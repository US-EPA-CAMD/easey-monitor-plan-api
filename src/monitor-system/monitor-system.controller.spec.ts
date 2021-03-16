import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MonitorSystemController } from './monitor-system.controller';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemDTO } from 'src/dtos/monitor-system.dto';


const mockConfigService = () => ({
    get: jest.fn(),
  });
  
  describe('-- Supplemental Methods Controller --', () => {
    let supplementalMethodsController: MonitorSystemController;
    let supplementalMethodsService: MonitorSystemService;
  
    beforeAll(async () => {
      const module = await Test.createTestingModule({
        controllers: [MonitorSystemController],
        providers: [
            MonitorSystemMap,
            MonitorSystemService,
            MonitorSystemRepository,
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
  
        const serviceSpy = jest
          .spyOn(supplementalMethodsService, 'getSystems')
          .mockResolvedValue(expectedResult);
  
        const result = await supplementalMethodsController.getSystems(monLocId);
  
        expect(serviceSpy).toHaveBeenCalledWith(monLocId);
        expect(result).toBe(result);
      });
    });

    describe('* getsSystemComponent', () => {
        it('should return a list of Monitoring Systems', async () => {
          const monLocId = '123';
          const expectedResult: MonitorSystemDTO[] = [];
    
          const serviceSpy = jest
            .spyOn(supplementalMethodsService, 'getSystems')
            .mockResolvedValue(expectedResult);
    
          const result = await supplementalMethodsController.getSystemComponents(monLocId);
    
          expect(serviceSpy).toHaveBeenCalledWith(monLocId);
          expect(result).toBe(result);
        });
      });
  }
  );
  