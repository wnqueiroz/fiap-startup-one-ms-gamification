import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({
  name: 'progress',
})
export class ProgressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  currentExperience: number;

  @Column({
    nullable: false,
  })
  experienceToNextLevel: number;

  @Column({
    nullable: false,
  })
  currentLevel: number;

  @Column({
    nullable: false,
  })
  nextLevel: number;

  @Column('uuid', {
    nullable: false,
  })
  idUser: string;

  @OneToOne(
    () => UserEntity,
    userEntity => userEntity.id,
  )
  @JoinColumn({ name: 'idUser' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
