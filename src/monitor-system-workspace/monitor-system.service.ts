import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import {
  MonitorSystemBaseDTO,
  MonitorSystemDTO,
} from '../dtos/monitor-system.dto';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemComponentWorkspaceService } from '../system-component-workspace/system-component.service';

@Injectable()
export class MonitorSystemWorkspaceService {
  constructor(
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly repository: MonitorSystemWorkspaceRepository,
    private readonly map: MonitorSystemMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,

    private readonly systemComponentService: SystemComponentWorkspaceService,
  ) {}

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        monitoringSystemId: 'ASC',
      },
    });
    return this.map.many(results);
  }

  async getSystem(monitoringSystemRecordId: string): Promise<MonitorSystem> {
    return await this.repository.findOne(monitoringSystemRecordId);
  }

  async createSystem(
    locationId: string,
    payload: MonitorSystemBaseDTO,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    const system = this.repository.create({
      id: uuid(),
      locationId,
      monitoringSystemId: payload.monitoringSystemId,
      systemDesignationCode: payload.systemDesignationCode,
      fuelCode: payload.fuelCode,
      systemTypeCode: payload.systemTypeCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(system);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(system);
  }

  async updateSystem(
    monitoringSystemRecordId: string,
    payload: MonitorSystemBaseDTO,
    locId: string,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    const system = await this.getSystem(monitoringSystemRecordId);
    system.systemTypeCode = payload.systemTypeCode;
    system.systemDesignationCode = payload.systemDesignationCode;
    system.fuelCode = payload.fuelCode;
    system.beginDate = payload.beginDate;
    system.beginHour = payload.beginHour;
    system.endDate = payload.endDate;
    system.endHour = payload.endHour;
    system.userId = userId;
    system.updateDate = new Date(Date.now());

    await this.repository.save(system);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(system);
  }

  async importSystem(
    systems: MonitorSystemBaseDTO[],
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const system of systems) {
        promises.push(
          new Promise(async innerResolve => {
            const innerPromises = [];
            const systemRecord = await this.repository.getSystemByLocIdSysIdentifier(
              locationId,
              system.monitoringSystemId,
            );

            if (systemRecord !== undefined) {
              await this.updateSystem(
                systemRecord.id,
                system,
                locationId,
                userId,
              );

              innerPromises.push(
                this.systemComponentService.importComponent(
                  locationId,
                  systemRecord.id,
                  system.components,
                  userId,
                ),
              );
            } else {
              const createdSystemRecord = await this.createSystem(
                locationId,
                system,
                userId,
              );
              innerPromises.push(
                this.systemComponentService.importComponent(
                  locationId,
                  createdSystemRecord.id,
                  system.components,
                  userId,
                ),
              );
            }

            await Promise.all(innerPromises);
            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }
}
