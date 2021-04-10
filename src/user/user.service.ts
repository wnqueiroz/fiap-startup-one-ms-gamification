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
    const user = this.userRepository.findOne({ where: { id: idUser } });
    const progress = await this.applyProgressRule(
      idUser,
      (await user).progress,
    );

    const savedProgress = this.progressRepository.save(progress);

    const userEntity = this.userRepository.create({
      id: idUser,
      idProgress: (await savedProgress).id,
    });

    return this.userRepository.save(userEntity);
  }

  async applyProgressRule(
    idUser: string,
    actualProgress: ProgressEntity,
  ): Promise<ProgressEntity> {
    if (!actualProgress) return await this.createInitialProgress(idUser);

    return await this.createProgressEvolution(idUser, actualProgress);
  }

  async createInitialProgress(idUser: string): Promise<ProgressEntity> {
    return this.progressRepository.create({
      idUser: idUser,
      currentExperience: 0,
      experienceToNextLevel: 64,
      currentLevel: 1,
      nextLevel: 2,
    });
  }

  async createProgressEvolution(
    idUser: string,
    actualProgress: ProgressEntity,
  ): Promise<ProgressEntity> {
    const evolvedProgress =
      (await actualProgress).currentExperience +
      (await actualProgress).currentExperience /
        (await actualProgress).currentLevel;
    const evolvedExperienceToNextLevel =
      (await actualProgress).currentExperience - evolvedProgress;

    return this.progressRepository.create({
      idUser: idUser,
      currentExperience: evolvedProgress,
      experienceToNextLevel: evolvedExperienceToNextLevel,
      currentLevel: 1,
      nextLevel: 2,
    });
  }
}
