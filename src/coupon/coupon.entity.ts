import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { CouponUserEntity } from './coupon-user.entity';

@Entity({
  name: 'coupon',
})
export class CouponEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  description: string;

  @Column({
    nullable: false,
    default: 0,
  })
  credits: number;

  @Column({
    nullable: false,
    default: true,
  })
  active: boolean;

  @OneToMany(
    () => CouponUserEntity,
    couponUser => couponUser.coupon,
  )
  couponUsers: CouponUserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
