import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

import { CouponController } from './coupon.controller';
import { CouponEntity } from './coupon.entity';
import { CouponService } from './coupon.service';

@Module({
  imports: [TypeOrmModule.forFeature([CouponEntity]), AuthModule],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
