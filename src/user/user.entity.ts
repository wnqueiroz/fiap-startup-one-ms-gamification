import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { ProgressEntity } from './progress.entity';

@Entity({
  name: 'user',
})
export class UserEntity {
  @Column('uuid', {
    primary: true,
    nullable: false,
  })
  id: string;

  @Column({
    default: 0,
  })
  credits: number;

  @Column('uuid', {
    nullable: false,
  })
  idProgress: string;

  @OneToOne(
    () => ProgressEntity,
    progressEntity => progressEntity.id,
  )
  @JoinColumn({ name: 'idProgress' })
  progress: ProgressEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
