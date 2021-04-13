import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCouponDTO {
  @IsNotEmpty({
    message: 'Informe o nome do cupom',
  })
  @ApiProperty({
    example: 'Vale 20% de desconto.',
  })
  name: string;

  @IsNotEmpty({
    message: 'Informe a descrição do cupom',
  })
  @ApiProperty({
    example: 'Ganhe 20% de desconto no seu próximo agendamento.',
  })
  description: string;

  @IsNotEmpty({
    message:
      'Informe a quantidade de dias de validade do cupom após ser resgatado.',
  })
  @ApiProperty({
    example: 30,
  })
  validDays: number;

  constructor(partial: Partial<CreateCouponDTO>) {
    Object.assign(this, partial);
  }
}
