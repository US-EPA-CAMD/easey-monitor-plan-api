import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MonitorSystemBaseDTO } from './monitor-system-base.dto';
import { UpdateSystemComponentDTO } from './system-component-update.dto';
import { UpdateSystemFuelFlowDTO } from './system-fuel-flow-update.dto';

export class UpdateMonitorSystemDTO extends MonitorSystemBaseDTO {
  @ValidateNested()
  @Type(() => UpdateSystemComponentDTO)
  components: UpdateSystemComponentDTO[];

  @ValidateNested()
  @Type(() => UpdateSystemFuelFlowDTO)
  fuelFlows: UpdateSystemFuelFlowDTO[];
}
