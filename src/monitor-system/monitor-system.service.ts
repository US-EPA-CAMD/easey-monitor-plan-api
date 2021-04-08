import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { ComponentRepository } from '../component/component.repository';
import { ComponentMap } from '../maps/component.map';
import { ComponentDTO } from '../dtos/component.dto';
import { MonitorSystemComponentRepository } from './monitor-system-component.repository';
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
@Injectable()
export class MonitorSystemService {
  constructor(@InjectRepository(MonitorSystemRepository)
    private repository: MonitorSystemRepository,
    private map: MonitorSystemMap,
    @InjectRepository(MonitorSystemComponentRepository)
    private repositoryMonSysComponents:MonitorSystemComponentRepository,
    @InjectRepository(ComponentRepository)
    private repositoryComponents: ComponentRepository,
    private mapComponents: ComponentMap,
     @InjectRepository(SystemFuelFlow)
    private repositorySysFuel: SystemFuelFlowRepository,
    private mapSysFuel: SystemFuelFlowMap,
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

    async getSysFuelFlow(monSysId: string): Promise<SystemFuelFlowDTO[]> {
      const fuel =  (await this.repositorySysFuel.SysFuelFlow()).filter(x=>x.monSysId == monSysId);
      const result = await this.mapSysFuel.many(fuel);
      return result;
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
        if(component.endDate == null){
          component['Active']= true;
        } 
        else{
          component['Active']= false;

        }
        mactchedcomponents.push(component)
      }
    })
    return mactchedcomponents;
}







}
