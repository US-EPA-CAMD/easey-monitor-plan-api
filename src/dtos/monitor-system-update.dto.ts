import { MonitorSystemBaseDTO } from './monitor-system-base.dto';
import { UpdateSystemComponentDTO } from './system-component-update.dto';
import { UpdateSystemFuelFlowDTO } from './system-fuel-flow-update.dto';

export class UpdateMonitorSystemDTO extends MonitorSystemBaseDTO {
  components: UpdateSystemComponentDTO[];
  fuelFlows: UpdateSystemFuelFlowDTO[];
}
