import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

import { CouponUserEntity } from './coupon-user.entity';
import { CouponController } from './coupon.controller';
import { CouponEntity } from './coupon.entity';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CouponEntity, CouponUserEntity]),
    AuthModule,
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
