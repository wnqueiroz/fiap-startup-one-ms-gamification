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

    if (!user) return await this.createUser(idUser);
    const progress = await this.createProgressEvolution(user.progress);

    const savedProgress = this.progressRepository.save(progress);

    const userEntity = this.userRepository.create({
      id: idUser,
      idProgress: (await savedProgress).id,
    });

    return this.userRepository.save(userEntity);
  }

  async createUser(idUser: string): Promise<UserEntity> {
    const progress = await this.createInitialProgress();

    const user = this.userRepository.create({
      id: idUser,
      credits: 0,
      idProgress: progress.id,
    });

    return this.userRepository.save(user);
  }

  async createInitialProgress(): Promise<ProgressEntity> {
    const progress = this.progressRepository.create({
      currentExperience: 0,
      experienceToNextLevel: 64,
      currentLevel: 1,
      nextLevel: 2,
    });

    return this.progressRepository.save(progress);
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
