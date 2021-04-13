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
import { UserDTO } from '../user/dto/user.dto';
import { GetCurrentUser } from './../auth/auth.annotation';
import { CurrentUserDTO } from './../auth/dto/current-user.dto';
import { CouponService } from './coupon.service';
import { CouponUserDTO } from './dto/coupon-user.dto';
import { CouponDTO } from './dto/coupon.dto';
import { CreateCouponUserDTO } from './dto/create-coupon-user.dto';
import { CreateCouponDTO } from './dto/create-coupon.dto';

@ApiTags('coupon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('availables')
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

  @Get('rescued')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all coupons with users' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: UserDTO,
    isArray: false,
  })
  async getWithUserCoupons(
    @GetCurrentUser() user: CurrentUserDTO,
  ): Promise<CouponDTO[]> {
    const { id } = user;

    const couponsEntity = await this.couponService.getWithUserCoupons(id);

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

  @Post('/rescue')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Associate a coupon to user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CouponUserDTO,
  })
  async rescue(
    @GetCurrentUser() user: CurrentUserDTO,
    @Body() createCouponDTO: CreateCouponUserDTO,
  ): Promise<CouponUserDTO> {
    const { id } = user;

    const couponUserEntity = await this.couponService.associateCupon(
      id,
      createCouponDTO,
    );

    return new CouponUserDTO(couponUserEntity);
  }
}
