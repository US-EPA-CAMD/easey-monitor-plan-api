import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserCheckOutMap } from '../maps/user-check-out.map';
import { UserCheckOutRepository } from './user-check-out.repository';
import { UserCheckOutService } from './user-check-out.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCheckOutRepository]), HttpModule],
  controllers: [],
  providers: [UserCheckOutRepository, UserCheckOutService, UserCheckOutMap],
  exports: [
    TypeOrmModule,
    UserCheckOutRepository,
    UserCheckOutService,
    UserCheckOutMap,
  ],
})
export class UserCheckOutModule {}
