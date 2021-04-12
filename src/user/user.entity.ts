import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { ProgressEntity } from '../progress/progress.entity';

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

  @Column({
    nullable: false,
  })
  name: string;

  @OneToOne(() => ProgressEntity)
  @JoinColumn()
  progress: ProgressEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
