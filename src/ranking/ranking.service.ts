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
      .where('progress.currentExperience >= :currentExperience', {
        currentExperience: user.progress.currentExperience,
      })
      .andWhere('progress.currentLevel >= :currentLevel', {
        currentLevel: user.progress.currentLevel,
      })
      .orderBy('progress.currentLevel', 'DESC')
      .addOrderBy('progress.currentExperience', 'DESC')
      .addOrderBy('progress.createdAt', 'DESC')
      .getMany();

    const index = data.findIndex(({ id }) => user.id === id);

    data = data.slice(0, index + 3);

    return data;
  }
}
