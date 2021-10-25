import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UserCheckOutService } from './user-check-out.service';
import { UserCheckOutRepository } from './user-check-out.repository';
import { UserCheckOutMap } from '../maps/user-check-out.map';

@Module({
  imports: [TypeOrmModule.forFeature([UserCheckOutRepository]), HttpModule],
  controllers: [],
  providers: [UserCheckOutService, UserCheckOutMap],
  exports: [TypeOrmModule, UserCheckOutService, UserCheckOutMap],
})
export class UserCheckOutModule {}
