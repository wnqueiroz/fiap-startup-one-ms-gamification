import { ApiProperty } from '@nestjs/swagger';

export class ProgressDTO {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    example: '0',
  })
  currentExperience: number;

  @ApiProperty({
    example: '64',
  })
  experienceToNextLevel: number;

  @ApiProperty({
    example: '1',
  })
  currentLevel: number;

  @ApiProperty({
    example: '2',
  })
  nextLevel: number;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<ProgressDTO>) {
    Object.assign(this, partial);
  }
}
