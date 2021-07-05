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
  private path = `${this.configService.get<string>('app.uri')}/locations`;

  constructor(private configService: ConfigService) {
    super();
  }

  private getStatus(type: string, entity: MonitorLocation): boolean {
    if (type === 'Unit') {
      const unitStatus = entity.unit.opStatuses[0];
      console.log(unitStatus);
      if (unitStatus.endDate == null && unitStatus.opStatusCode == 'RET') {
        return false;
      }
      return true;
    }

    if (type === 'Stack') {
      if (entity.stackPipe.retireDate == null) {
        return true;
      }
    }

    return false;
  }

  public async one(entity: MonitorLocation): Promise<MonitorLocationDTO> {
    const type = entity.unit ? 'Unit' : 'Stack';
    return {
      id: entity.id,
      name: entity.unit ? entity.unit.name : entity.stackPipe.name,
      type: type,
      active: this.getStatus(type, entity),
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
