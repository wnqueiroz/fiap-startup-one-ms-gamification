import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

import { ProgressEntity } from '../progress/progress.entity';
import { UserEntity } from './../user/user.entity';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProgressEntity]), AuthModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
