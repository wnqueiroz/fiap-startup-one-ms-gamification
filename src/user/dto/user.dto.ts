import { ApiProperty } from '@nestjs/swagger';

import { ProgressDTO } from './progress.dto';

export class UserDTO {
  @ApiProperty({
    example: '10',
  })
  credits: number;

  @ApiProperty({ type: ProgressDTO })
  progress: ProgressDTO;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
