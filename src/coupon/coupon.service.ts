import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CouponEntity } from './coupon.entity';
import { CreateCouponDTO } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(CouponEntity)
    private couponRepository: Repository<CouponEntity>,
  ) {}

  async getAll(): Promise<CouponEntity[]> {
    return this.couponRepository.find({
      where: {
        active: true,
      },
    });
  }

  async create(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
    const couponEntity = this.couponRepository.create(createCouponDTO);

    return this.couponRepository.save(couponEntity);
  }
}
