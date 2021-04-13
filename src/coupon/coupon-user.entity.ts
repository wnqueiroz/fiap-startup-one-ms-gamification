import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { CouponEntity } from './coupon.entity';

@Entity({
  name: 'coupon_user',
})
export class CouponUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', {
    nullable: true,
  })
  idUser: string;

  @Column('uuid', {
    nullable: true,
  })
  idCoupon: string;

  @Column({
    nullable: false,
    default: '',
  })
  code: string;

  @ManyToOne(
    () => CouponEntity,
    coupon => coupon.id,
  )
  @JoinColumn({ name: 'idCoupon' })
  coupon: CouponEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
