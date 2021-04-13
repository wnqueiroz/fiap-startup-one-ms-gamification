import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponUserDTO {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idCoupon: string;

  constructor(partial: Partial<CreateCouponUserDTO>) {
    Object.assign(this, partial);
  }
}
