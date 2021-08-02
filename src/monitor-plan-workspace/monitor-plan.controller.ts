import {
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';

import { UserDTO } from '../dtos/user.dto';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';

@ApiTags('Plans & Configurations')
@Controller()
export class MonitorPlanWorkspaceController {
  constructor(
    private service: MonitorPlanWorkspaceService,
    private ucoService: UserCheckOutService,
  ) {}

  @Get(':orisCode/configurations')
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description: 'Retrieves workspace Monitor Plan configurations',
  })
  getConfigurations(
    @Param('orisCode', ParseIntPipe) orisCode: number,
  ): Promise<MonitorPlanDTO[]> {
    return this.service.getConfigurations(orisCode);
  }

  @Get('check-outs')
  @ApiOkResponse({
    isArray: true,
    type: UserCheckOutDTO,
    description:
      'Retrieves workspace Monitor Plan configuration records that are checked out by users',
  })
  getCheckedOutConfigurations(): Promise<UserCheckOutDTO[]> {
    return this.ucoService.getCheckedOutConfigurations();
  }

  @Post(':id/check-outs')
  @ApiOkResponse({
    type: UserCheckOutDTO,
    description: 'Checks Out a Monitor Plan configuration',
  })
  checkOutConfiguration(
    @Param('id') id: string,
    @Body() payload: UserDTO,
  ): Promise<UserCheckOutDTO> {
    return this.ucoService.checkOutConfiguration(id, payload.username);
  }

  @Put(':id/check-outs')
  @ApiOkResponse({
    type: UserCheckOutDTO,
    description: 'Updates last activity for a checked out Monitor Plan',
  })
  updateLastActivity(@Param('id') id: string): Promise<UserCheckOutDTO> {
    return this.ucoService.updateLastActivity(id);
  }

  @Delete(':id/check-outs')
  @ApiOkResponse({
    description: 'Check-In a Monitor Plan configuration',
  })
  checkInConfiguration(@Param('id') id: string): Promise<void> {
    return this.ucoService.checkInConfiguration(id);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Retrieves all Monitor Plan instruction in JSON',
  })
  getMonPlanInJson(@Param('id') id: string) {
    return id;
  }
}
