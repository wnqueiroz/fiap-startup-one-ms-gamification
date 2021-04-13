import { ApiProperty } from '@nestjs/swagger';

export class CouponUserDTO {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idUser: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idCoupon: string;

  constructor(partial: Partial<CouponUserDTO>) {
    Object.assign(this, partial);
  }
}
