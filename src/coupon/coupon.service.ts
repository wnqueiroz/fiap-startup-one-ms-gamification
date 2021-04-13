import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CouponUserEntity } from './coupon-user.entity';
import { CouponEntity } from './coupon.entity';
import { CouponUserDTO } from './dto/coupon-user.dto';
import { CreateCouponUserDTO } from './dto/create-coupon-user.dto';
import { CreateCouponDTO } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(CouponEntity)
    private couponRepository: Repository<CouponEntity>,
    @InjectRepository(CouponUserEntity)
    private couponUserRepository: Repository<CouponUserEntity>,
  ) {}

  async getAll(): Promise<CouponEntity[]> {
    return this.couponRepository.find({
      where: {
        active: true,
      },
    });
  }

  async getWithUserCoupons(idUser: string): Promise<CouponEntity[]> {
    return this.couponRepository
      .createQueryBuilder('coupon')
      .innerJoinAndSelect('coupon.couponUsers', 'couponUsers')
      .where('couponUsers.idUser = :idUser', {
        idUser,
      })
      .getMany();
  }

  async create(createCouponDTO: CreateCouponDTO): Promise<CouponEntity> {
    const couponEntity = this.couponRepository.create({
      ...createCouponDTO,
      ...{
        active: true,
      },
    });

    return this.couponRepository.save(couponEntity);
  }

  generateCode(): string {
    const length = 7;
    const result = [];
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength)),
      );
    }
    return result.join('').toUpperCase();
  }

  async associateCupon(
    idUser: string,
    createCouponUserDTO: CreateCouponUserDTO,
  ): Promise<CouponUserDTO> {
    const couponUser = await this.couponUserRepository.find({
      where: {
        idCoupon: createCouponUserDTO.idCoupon,
        idUser,
      },
    });

    if (couponUser && couponUser.length)
      throw new UnprocessableEntityException(
        'Coupon already assigned to the user',
      );

    const couponEntity = await this.couponRepository.findOne(
      createCouponUserDTO.idCoupon,
    );

    if (!couponEntity) throw new NotFoundException('Coupon not found');

    const couponUserEntity = this.couponUserRepository.create({
      ...createCouponUserDTO,
      ...{
        idUser,
        code: this.generateCode(),
      },
    });

    return this.couponUserRepository.save(couponUserEntity);
  }
}
