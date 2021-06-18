import { Entity } from 'typeorm';

import { MonitorMethod as MonitorMethodBase } from '../monitor-method.entity';

@Entity({ name: 'camdecmpswks.monitor_method' })
export class MonitorMethod extends MonitorMethodBase {}
