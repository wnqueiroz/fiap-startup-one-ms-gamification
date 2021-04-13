import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProgressEntity } from '../progress/progress.entity';
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

  async createUser(data: {
    idUser: string;
    name: string;
  }): Promise<UserEntity> {
    const progressEntity = this.progressRepository.create({
      currentExperience: 0,
      experienceToNextLevel: this.getCurrentExperienceBasedOnLevel(1),
      currentLevel: 1,
      nextLevel: 2,
    });
    const savedProgress = await this.progressRepository.save(progressEntity);

    const userEntity = this.userRepository.create({
      id: data.idUser,
      name: data.name,
      credits: 0,
      progress: savedProgress,
    });
    return await this.userRepository.save(userEntity);
  }

  async finishAppointment(idUser: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: idUser },
      relations: ['progress'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let currentLevel = user.progress.currentLevel;

    let finalExperience = user.progress.currentExperience + 100;

    let experienceToNextLevel = this.getCurrentExperienceBasedOnLevel(
      currentLevel,
    );

    let upgradedLevel = false;

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;

      currentLevel = currentLevel + 1;

      experienceToNextLevel = this.getCurrentExperienceBasedOnLevel(
        currentLevel,
      );

      upgradedLevel = true;
    }

    const progressEntity = this.progressRepository.create({
      id: user.progress.id,
      currentExperience: finalExperience,
      experienceToNextLevel,
      currentLevel,
      nextLevel: currentLevel + 1,
    });

    const savedProgress = await this.progressRepository.save(progressEntity);

    const userEntity = this.userRepository.create({
      id: idUser,
      credits: upgradedLevel ? user.credits + 1 : user.credits,
      progress: savedProgress,
    });

    return this.userRepository.save(userEntity);
  }

  getCurrentExperienceBasedOnLevel(level: number): number {
    return Math.pow((level + 1) * 7, 2);
  }
}
