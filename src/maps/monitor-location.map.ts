import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

import { BaseMap } from './base.map';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorSystemMap } from '../maps/monitor-system.map';

@Injectable()
export class MonitorLocationMap extends BaseMap<
  MonitorLocation,
  MonitorLocationDTO
> {
  private path = `${this.configService.get<string>('app.uri')}/locations`;

  constructor(
    private configService: ConfigService,
    private methodMap: MonitorMethodMap,
    private matsMethodMap: MatsMethodMap,
    private formulaMap: MonitorFormulaMap,
    private spanMap: MonitorSpanMap,
    private loadMap: MonitorLoadMap,
    private systemMap: MonitorSystemMap,
  ) {
    super();
  }

  private getStatus(type: string, entity: MonitorLocation): boolean {
    if (type === 'Unit') {
      const unitStatus = entity.unit.opStatuses[0];
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
    const methods = entity.methods
      ? await this.methodMap.many(entity.methods)
      : null;
    const matsMethods = entity.matsMethods
      ? await this.matsMethodMap.many(entity.matsMethods)
      : null;
    const formulas = entity.formulas
      ? await this.formulaMap.many(entity.formulas)
      : null;
    const spans = entity.spans ? await this.spanMap.many(entity.spans) : null;
    const loads = entity.loads ? await this.loadMap.many(entity.loads) : null;
    const systems = entity.systems
      ? await this.systemMap.many(entity.systems)
      : null;

    return {
      id: entity.id,
      name: entity.unit ? entity.unit.name : entity.stackPipe.name,
      type,
      active: this.getStatus(type, entity),
      retireDate: entity.stackPipe ? entity.stackPipe.retireDate : null,
      methods,
      matsMethods,
      formulas,
      spans,
      loads,
      systems,
      // links: [
      //   {
      //     rel: 'self',
      //     href: `${this.path}/${entity.id}`,
      //   },
      //   {
      //     rel: 'methods',
      //     href: `${this.path}/${entity.id}/methods`,
      //   },
      //   {
      //     rel: 'systems',
      //     href: `${this.path}/${entity.id}/systems`,
      //   },
      //   {
      //     rel: 'spans',
      //     href: `${this.path}/${entity.id}/spans`,
      //   },
      // ],
    };
  }
}
