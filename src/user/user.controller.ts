import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { KAFKA_TOPICS } from 'src/contants';

import { GetCurrentUser } from '../auth/auth.annotation';
import { CurrentUserDTO } from '../auth/dto/current-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('userGamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get user progress' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: UserDTO,
    isArray: false,
  })
  async getService(@GetCurrentUser() user: CurrentUserDTO): Promise<UserDTO> {
    const { id } = user;
    const userEntity = await this.userService.getOne(id);

    return new UserDTO(userEntity);
  }

  @MessagePattern(KAFKA_TOPICS.APPOINTMENTS_FINISHED)
  async finishAppointment(
    @Payload()
    message: {
      value: any;
    },
  ): Promise<void> {
    const { id } = message.value;
    await this.userService.finishAppointment(id);
  }
}