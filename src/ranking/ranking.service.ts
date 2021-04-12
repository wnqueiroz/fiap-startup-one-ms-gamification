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
    const firstAboveUserAndUser = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.progress', 'progress')
      .where('progress.currentExperience >= :currentExperience', {
        currentExperience: user.progress.currentExperience,
      })
      .andWhere('progress.currentLevel >= :currentLevel', {
        currentLevel: user.progress.currentLevel,
      })
      .orderBy('progress.currentLevel', 'DESC')
      .addOrderBy('progress.currentExperience', 'DESC')
      .getMany();

    const twoBelowUser = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.progress', 'progress')
      .where('progress.currentExperience <= :currentExperience', {
        currentExperience: user.progress.currentExperience,
      })
      .andWhere('progress.currentLevel <= :currentLevel', {
        currentLevel: user.progress.currentLevel,
      })
      .andWhere('user.id NOT IN (:...ids)', {
        ids: firstAboveUserAndUser.map(({ id }) => id),
      })
      .orderBy('progress.currentLevel', 'DESC')
      .addOrderBy('progress.currentExperience', 'DESC')
      .take(2)
      .getMany();

    return [...firstAboveUserAndUser, ...twoBelowUser];
  }

  private async getLastUsers(user: UserEntity): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.progress', 'progress')
      .orderBy('progress.currentExperience', 'ASC')
      .where('progress.currentExperience <= :currentExperience', {
        currentExperience: user.progress.currentExperience,
      })
      .take(2)
      .getMany();
  }
}
