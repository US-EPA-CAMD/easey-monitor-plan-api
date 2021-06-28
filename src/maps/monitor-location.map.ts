import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseMap } from './base.map';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

@Injectable()
export class MonitorLocationMap extends BaseMap<
  MonitorLocation,
  MonitorLocationDTO
> {
  private path = `${this.configService.get<string>(
    'app.uri',
  )}/monitor-locations`;

  constructor(private configService: ConfigService) {
    super();
  }

  public async one(entity: MonitorLocation): Promise<MonitorLocationDTO> {
    return {
      id: entity.id,
      name: entity.unit ? entity.unit.name : entity.stackPipe.name,
      type: entity.unit ? 'Unit' : 'Stack',
      active: false,
      retireDate: entity.stackPipe ? entity.stackPipe.retireDate : null,

      links: [
        {
          rel: 'self',
          href: `${this.path}/${entity.id}`,
        },
        {
          rel: 'methods',
          href: `${this.path}/${entity.id}/methods`,
        },
        {
          rel: 'systems',
          href: `${this.path}/${entity.id}/systems`,
        },
        {
          rel: 'spans',
          href: `${this.path}/${entity.id}/spans`,
        },
      ],
    };
  }
}
