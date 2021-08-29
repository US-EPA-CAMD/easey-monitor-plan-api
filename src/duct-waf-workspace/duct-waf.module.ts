import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DuctWafWorkspaceController } from './duct-waf.controller';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { DuctWafMap } from '../maps/duct-waf.map';

@Module({
  imports: [TypeOrmModule.forFeature([DuctWafWorkspaceRepository])],
  controllers: [DuctWafWorkspaceController],
  providers: [DuctWafWorkspaceService, DuctWafMap],
  exports: [TypeOrmModule, DuctWafWorkspaceService, DuctWafMap],
})
export class DuctWafWorkspaceModule {}
