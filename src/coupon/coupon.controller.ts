import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CouponService } from './coupon.service';
import { CouponDTO } from './dto/coupon.dto';
import { CreateCouponDTO } from './dto/create-coupon.dto';

@ApiTags('coupon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/coupons')
@Controller()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: CouponDTO,
    isArray: true,
  })
  async getAll(): Promise<CouponDTO[]> {
    const couponsEntity = await this.couponService.getAll();

    return couponsEntity.map(couponEntity => new CouponDTO(couponEntity));
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create a coupon' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CouponDTO,
  })
  async create(@Body() createCouponDTO: CreateCouponDTO): Promise<CouponDTO> {
    const couponEntity = await this.couponService.create(createCouponDTO);

    return new CouponDTO(couponEntity);
  }
}
