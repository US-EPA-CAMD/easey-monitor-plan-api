import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentRepository } from './component.repository';
import { MonitorSystemComponentRepository} from "../monitor-system/monitor-system-component.repository"
import { ComponentMap } from '../maps/component.map';
import { MonitorSystemComponent } from 'src/entities/monitor-system-component.entity';
import{systemComponentMap} from '../maps/monitor-system-component.map'

@Injectable()
export class ComponentService {
  constructor(@InjectRepository(ComponentRepository)
    private repository: ComponentRepository,
    private map: ComponentMap,
    @InjectRepository(MonitorSystemComponentRepository)
    private repositoryMonComponents:MonitorSystemComponentRepository,
    private monComponentsMap: systemComponentMap
  ) {}

  async getComponentsByLocation(monLocId: string): Promise<ComponentDTO[]> {
    const findOpts: FindManyOptions = {
      select: [ "id","monLocId","componentTypeCode","basisCode", "modelVersion","manufacturer","serialNumber","hgConverterInd"],
      where: { monLocId: monLocId }
    }
    const systemComponents = await this.repositoryMonComponents.getSystemComponents();
    const results = await this.repository.find(findOpts);
    const components = await this.map.many(results);
    return this.setComponentDate(components,systemComponents);
  }


  setComponentDate(components:ComponentDTO[], monitorSystemComponent: MonitorSystemComponent[] ): ComponentDTO[] {
    components.forEach(c => {
    var sysComponent = monitorSystemComponent.find(x=> x.componentId == c.id);
      if(sysComponent != null){
        c.beginHour = sysComponent.beginHour;
        c.endHour = sysComponent.endHour;
        c.beginDate = sysComponent.beginDate;
        c.endDate = sysComponent.endDate;
      }
    })
    return components;
}
}
