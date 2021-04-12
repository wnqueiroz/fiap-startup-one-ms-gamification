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

    const ranking: UserEntity[] = [];

    ranking.concat(await this.getFirstUsers(userEntity));
    ranking.push(userEntity);
    ranking.concat(await this.getLastUsers(userEntity));

    return new Promise<UserEntity[]>(resolve => {
      resolve(ranking);
    });
  }

  private async getFirstUsers(user: UserEntity): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.progress', 'progress')
      .orderBy('progress.currentExperience', 'ASC')
      .where('progress.currentExperience >= :currentExperience', {
        currentExperience: user.progress.currentExperience,
      })
      .getMany();
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
