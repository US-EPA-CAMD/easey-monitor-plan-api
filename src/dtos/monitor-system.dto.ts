import { MonitorSystemBaseDTO } from './monitor-system-base.dto';
import { SystemComponentDTO } from './system-component.dto';
import { SystemFuelFlowDTO } from './system-fuel-flow.dto';

export class MonitorSystemDTO extends MonitorSystemBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
  components: SystemComponentDTO[];
  fuelFlows: SystemFuelFlowDTO[];
}
