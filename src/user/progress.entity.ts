import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
