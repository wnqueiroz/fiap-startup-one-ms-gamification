import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProgressEntity } from './progress.entity';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProgressEntity)
    private progressRepository: Repository<ProgressEntity>,
  ) {}

  async getOne(idUser: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne(idUser, {
      relations: ['progress'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    return userEntity;
  }

  async finishAppointment(idUser: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: idUser },
      relations: ['progress'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const evolvedProgress = await this.createProgressEvolution(user.progress);

    const savedProgress = await this.progressRepository.save(evolvedProgress);

    const evolvedUser = this.userRepository.create({
      id: idUser,
      credits: user.credits + 1,
      progress: savedProgress,
    });

    return this.userRepository.save(evolvedUser);
  }

  async createProgressEvolution(
    actualProgress: ProgressEntity,
  ): Promise<ProgressEntity> {
    const evolvedExperience =
      actualProgress.currentExperience +
      actualProgress.currentExperience / actualProgress.currentLevel;
    const evolvedExperienceToNextLevel =
      actualProgress.currentExperience - evolvedExperience;

    return this.progressRepository.create({
      currentExperience: evolvedExperience,
      experienceToNextLevel: evolvedExperienceToNextLevel,
      currentLevel: 1,
      nextLevel: 2,
    });
  }
}
