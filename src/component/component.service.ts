import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentRepository } from './component.repository';
import { MonitorSystemComponentRepository } from '../monitor-system/monitor-system-component.repository';
import { ComponentMap } from '../maps/component.map';
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeRepository } from './analyzer-range.repository';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentRepository)
    private repository: ComponentRepository,
    private map: ComponentMap,
    @InjectRepository(MonitorSystemComponentRepository)
    private repositoryMonComponents: MonitorSystemComponentRepository,
    @InjectRepository(AnalyzerRangeRepository)
    private repositoryAnalyzerRange: AnalyzerRangeRepository,
    private analyzerRangeMap: AnalyzerRangeMap,
  ) {}

  async getComponentsByLocation(monLocId: string): Promise<ComponentDTO[]> {
    const findOpts: FindManyOptions = {
      select: [
        'id',
        'monLocId',
        'componentTypeCode',
        'basisCode',
        'acquisitionMethodCode',
        'componentIdentifier',
        'modelVersion',
        'manufacturer',
        'serialNumber',
        'hgConverterInd',
      ],
      where: { monLocId: monLocId },
    };
    const systemComponents = await this.repositoryMonComponents.getSystemComponents();
    const results = await this.repository.find(findOpts);
    const components = await this.map.many(results);
    return this.setComponentDate(components, systemComponents);
  }

  async getAnalyzerRangesByComponent(
    componentId: string,
  ): Promise<AnalyzerRangeDTO[]> {
    const systemComponents = await this.repositoryAnalyzerRange.AnalyzerRange();
    const filteredSystemComponents = systemComponents.filter(
      x => x.componentId == componentId,
    );
    return this.analyzerRangeMap.many(filteredSystemComponents);
  }

  setComponentDate(
    components: ComponentDTO[],
    monitorSystemComponent: MonitorSystemComponent[],
  ): ComponentDTO[] {
    components.forEach(c => {
      const sysComponent = monitorSystemComponent.find(
        x => x.componentId == c.id,
      );
      if (sysComponent != null) {
        c.beginHour = sysComponent.beginHour;
        c.endHour = sysComponent.endHour;
        c.beginDate = sysComponent.beginDate;
        c.endDate = sysComponent.endDate;
        if (c.endDate == null) {
          c['active'] = true;
        } else {
          c['active'] = false;
        }
      }
    });

    return components;
  }
}
