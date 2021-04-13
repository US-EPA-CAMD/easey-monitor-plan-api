import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentRepository } from './component.repository';
import{ComponentMap} from '../maps/component.map';
import { ComponentDTO } from '../dtos/component.dto';
import {MonitorSystemComponentRepository} from '../monitor-system/monitor-system-component.repository'
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import{systemComponentMap} from '../maps/monitor-system-component.map'
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { AnalyzerRangeRepository } from './analyzer-range.repository';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRange } from '../entities/analyzer-range.entity';
import { AnalyzerRangeDTO } from 'src/dtos/analyzer-range.dto';


const mockConfigService = () => ({
    get: jest.fn(),
  });
  
  describe('-- components Controller --', () => {
    let supplementalMethodsController: ComponentController;
    let supplementalMethodsService: ComponentService;
  
    beforeAll(async () => {
      const module = await Test.createTestingModule({
        controllers: [ComponentController],
        providers: [
            ComponentMap,
            ComponentService,
            ComponentRepository,
            MonitorSystemComponentRepository,
            MonitorSystemComponent,
            systemComponentMap,
            MonitorMethodMap,
            AnalyzerRangeRepository,
            AnalyzerRangeMap,
            AnalyzerRange,


          {
            provide: ConfigService,
            useFactory: mockConfigService,
          },
        ],
      }).compile();
  
      supplementalMethodsController = module.get(ComponentController);
      supplementalMethodsService = module.get(ComponentService);
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    describe('* getsComponents', () => {
      it('should return a list of Components ', async () => {
        const monLocId = '123';
        const expectedResult: ComponentDTO[] = [];
  
        const serviceSpy = jest
          .spyOn(supplementalMethodsService, 'getComponentsByLocation')
          .mockResolvedValue(expectedResult);
  
        const result = await supplementalMethodsController.getComponentsbyLoc(monLocId);
  
        expect(serviceSpy).toHaveBeenCalledWith(monLocId);
        expect(result).toBe(result);
      });
    });

    describe('* getAnalyzerRangesByComponent', () => {
      it('should return a list of Components ', async () => {
        const monLocId = '123';
        const expectedResult: AnalyzerRangeDTO[] = [];
  
        const serviceSpy = jest
          .spyOn(supplementalMethodsService, 'getAnalyzerRangesByComponent')
          .mockResolvedValue(expectedResult);
  
        const result = await supplementalMethodsController.getAnalyzerRangesByComponent(monLocId);
  
        expect(serviceSpy).toHaveBeenCalledWith(monLocId);
        expect(result).toBe(result);
      });
    });
  }   
  );
  