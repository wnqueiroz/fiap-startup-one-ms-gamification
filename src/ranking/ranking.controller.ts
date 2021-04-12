import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

import { GetCurrentUser } from '../auth/auth.annotation';
import { CurrentUserDTO } from '../auth/dto/current-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDTO } from './../user/dto/user.dto';
import { RankingService } from './ranking.service';

@ApiTags('ranking')
@ApiBearerAuth()
@Controller('v1/ranking')
@Controller()
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get ranking of users' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: UserDTO,
    isArray: false,
  })
  async getService(@GetCurrentUser() user: CurrentUserDTO): Promise<UserDTO[]> {
    const { id } = user;
    const usersEntity = await this.rankingService.getRanking(id);

    return usersEntity.map(userEntity => new UserDTO(userEntity));
  }
}
