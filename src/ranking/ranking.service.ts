import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getRanking(idUser: string): Promise<UserEntity[]> {
    const userEntity = await this.userRepository.findOne(idUser, {
      relations: ['progress'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    return this.getRankingData(userEntity);
  }

  private async getRankingData(user: UserEntity): Promise<UserEntity[]> {
    let data = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.progress', 'progress')
      .where('progress.currentLevel >= :currentLevel', {
        currentLevel: user.progress.currentLevel,
      })
      .orWhere('progress.currentExperience >= :currentExperience', {
        currentExperience: user.progress.currentExperience,
      })
      .orderBy('progress.currentLevel', 'DESC')
      .addOrderBy('progress.currentExperience', 'DESC')
      .addOrderBy('progress.createdAt', 'DESC')
      .getMany();

    const userIsOnPodium = data.length <= 3;

    if (userIsOnPodium) {
      const others = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.progress', 'progress')
        .where('progress.currentExperience <= :currentExperience', {
          currentExperience: user.progress.currentExperience,
        })
        .andWhere('progress.currentLevel <= :currentLevel', {
          currentLevel: user.progress.currentLevel,
        })
        .where('user.id NOT IN (:...ids)', { ids: data.map(({ id }) => id) })
        .orderBy('progress.currentLevel', 'DESC')
        .addOrderBy('progress.currentExperience', 'DESC')
        .addOrderBy('progress.createdAt', 'DESC')
        .getMany();

      data = [...data, ...others];
    }

    return data;
  }
}
