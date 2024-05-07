import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsedIdentifierRepository } from './used-identifier.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsedIdentifierRepository])],
  controllers: [],
  providers: [UsedIdentifierRepository],
  exports: [TypeOrmModule, UsedIdentifierRepository],
})
export class UsedIdentifierModule {}
