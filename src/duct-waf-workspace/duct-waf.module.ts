import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DuctWafWorkspaceRepository } from './duct-waf.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DuctWafWorkspaceRepository])],
  providers: [],
  controllers: [],
})
export class DuctWafWorkspaceModule {}
