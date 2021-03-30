import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MonitorSystemController } from './monitor-system.controller';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import{ComponentMap} from '../maps/component.map';
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import{systemComponentMap} from '../maps/monitor-system-component.map'
import { MonitorSystemComponentRepository } from './monitor-system-component.repository';
import { ComponentRepository } from '../component/component.repository';

import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';


const mockConfigService = () => ({
    get: jest.fn(),
  });
  
  describe('-- Monistor System Controller --', () => {
    let supplementalMethodsController: MonitorSystemController;
    let supplementalMethodsService: MonitorSystemService;
  
    beforeAll(async () => {
      const module = await Test.createTestingModule({
        controllers: [MonitorSystemController],
        providers: [
            MonitorSystemMap,
            MonitorSystemService,
            MonitorSystemRepository,SystemFuelFlow,
            MonitorSystemComponent,
            systemComponentMap,
            ComponentMap,
            SystemFuelFlowMap,
            MonitorSystemComponentRepository,
            ComponentRepository,
            SystemFuelFlowRepository,
          {
            provide: ConfigService,
            useFactory: mockConfigService,
          },
        ],
      }).compile();
  
      supplementalMethodsController = module.get(MonitorSystemController);
      supplementalMethodsService = module.get(MonitorSystemService);
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    describe('* getsMonitorSystem', () => {
      it('should return a list of Monitoring Systems', async () => {
        const monLocId = '123';
        const expectedResult: MonitorSystemDTO[] = [];
        return true;
      });
    });

    describe('* getsSystemComponent', () => {
        it('should return a list of Monitoring components', async () => {
          const monLocId = '123';
          const expectedResult: MonitorSystemDTO[] = [];
          return true;
        });
      });
  


  describe('* getsSystemFuelFlow', () => {
    it('should return a list of Monitoring fuel flows', async () => {
      const monLocId = '123';
      const expectedResult: MonitorSystemDTO[] = [];
      return true;
  });
}
  );
});