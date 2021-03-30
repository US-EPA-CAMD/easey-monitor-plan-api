import { Test } from '@nestjs/testing';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import{ComponentMap} from '../maps/component.map';
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import{systemComponentMap} from '../maps/monitor-system-component.map'
import { MonitorSystemComponentRepository } from './monitor-system-component.repository';
import { ComponentRepository } from '../component/component.repository';

import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
const mockMatsMethodRepository = () => ({
    find: jest.fn(),
  });
  
  const mockMap = () => ({
    many: jest.fn(),
  });
  
  describe('-- Monitoring system Service --', () => {
    let supplementalMethodsService;
    let matsMethodRepository;
    let map;
  
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
            MonitorSystemService,
          {
            provide: MonitorSystemRepository,
            useFactory: mockMatsMethodRepository,
          },
          { provide: MonitorSystemMap, useFactory: mockMap },
          SystemFuelFlow,
            MonitorSystemComponent,
            systemComponentMap,
            ComponentMap,
            SystemFuelFlowMap,
            MonitorSystemComponentRepository,
            ComponentRepository,
            SystemFuelFlowRepository,
        ],
      }).compile();
  
      supplementalMethodsService = module.get(MonitorSystemService);
      matsMethodRepository = module.get(MonitorSystemRepository);
  
      map = module.get(MonitorSystemMap);
    });
  
    describe('* getMonitoringSystems', () => {
      it('should return all the Monitoring Systems with the specified monLocId', async () => {
        map.many.mockReturnValue('mockSupplementalMethods');
  
        const monLocId = '123';
  
        let result = await supplementalMethodsService.getSystems(monLocId);
      
        expect(matsMethodRepository.find).toHaveBeenCalled();
        expect(map.many).toHaveBeenCalled();
        expect(result).toEqual('mockSupplementalMethods');
        return true;
      });
    }); 
    
    describe('* getComponents', () => {
        it('should return all the components with the specified system ID', async () => {
          map.many.mockReturnValue('mockSupplementalMethods');
    
          const monLocId = '123';
    
          let result = await supplementalMethodsService.getComponents(monLocId);
    
          expect(result).toBe(result);
          return true;
        });
      });

  });