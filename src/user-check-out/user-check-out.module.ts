import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserCheckOutService } from './user-check-out.service';
import { UserCheckOutRepository } from './user-check-out.repository';
import { UserCheckOutMap } from '../maps/user-check-out.map';

@Module({
  imports: [TypeOrmModule.forFeature([UserCheckOutRepository])],
  controllers: [],
  providers: [UserCheckOutService, UserCheckOutMap],
  exports: [TypeOrmModule, UserCheckOutService, UserCheckOutMap],
})
export class UserCheckOutModule {}
