import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { ComponentRepository } from 'src/component/component.repository';
import { ComponentMap } from '../maps/component.map';
import { ComponentDTO } from 'src/dtos/component.dto';
import { MonitorSystemComponentRepository } from './monitor-system-component.repository';
import { systemComponentMap } from 'src/maps/monitor-system-component.map';
import { MonitorSystemComponent } from 'src/entities/monitor-system-component.entity';

@Injectable()
export class MonitorSystemService {
  constructor(@InjectRepository(MonitorSystemRepository)
    private repository: MonitorSystemRepository,
    private map: MonitorSystemMap,
    @InjectRepository(MonitorSystemComponentRepository)
    private repositoryMonSysComponents:MonitorSystemComponentRepository,
    private monComponentsMap: systemComponentMap,
    @InjectRepository(ComponentRepository)
    private repositoryComponents: ComponentRepository,
    private mapComponents: ComponentMap,
  ) {}

  async getSystems(monLocId: string): Promise<MonitorSystemDTO[]> {
    const findOpts: FindManyOptions = {
      select: [ "id", "monLocId", "systemType","systemDesignationCode","systemIdentifier","fuelCode", "beginDate","endDate","beginHour","endHour"],
      where: { monLocId: monLocId }
    }
    const results = await this.repository.find(findOpts);
    return this.map.many(results);
    
  }

  async getComponents(monSysId: string): Promise<ComponentDTO[]> {
    const ComponentStatus = await this.repositoryMonSysComponents.getSystemComponents();
    const components = await this.repositoryComponents.getSystemComponents();
    const componentDTO = await this.mapComponents.many(components);
    const systemComponents = ComponentStatus.filter(x=>x.monSysId ==monSysId );
    return this.setComponentDate(componentDTO, systemComponents);
    }

  
  setComponentDate(components:ComponentDTO[], monitorSystemComponent: MonitorSystemComponent[] ): ComponentDTO[] {
    
    const mactchedcomponents :ComponentDTO[] = [];
    monitorSystemComponent.forEach(msc => {
    var component = components.find(x=> x.id == msc.componentId);
      if(component != null){
        component.beginHour = msc.beginHour;
        component.endHour = msc.endHour;
        component.beginDate = msc.beginDate;
        component.endDate = msc.endDate;
        mactchedcomponents.push(component)
      }
    })
    return mactchedcomponents;
}







}
