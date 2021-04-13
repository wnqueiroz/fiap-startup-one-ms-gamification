import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CouponDTO {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    example: 'Vale 20% de desconto.',
  })
  name: string;

  @ApiProperty({
    example: 'Ganhe 20% de desconto no seu próximo agendamento.',
  })
  description: string;

  @Exclude()
  active: boolean;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<CouponDTO>) {
    Object.assign(this, partial);
  }
}
