import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentRepository } from './component.repository';
import{ComponentMap} from '../maps/component.map';
import { ComponentDTO } from '../dtos/component.dto';


const mockConfigService = () => ({
    get: jest.fn(),
  });
  
  describe('-- Supplemental Methods Controller --', () => {
    let supplementalMethodsController: ComponentController;
    let supplementalMethodsService: ComponentService;
  
    beforeAll(async () => {
      const module = await Test.createTestingModule({
        controllers: [ComponentController],
        providers: [
            ComponentMap,
            ComponentService,
            ComponentRepository,
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
  
   

    describe('* getSystemComponent', () => {
        it('should return a list of components', async () => {
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
  }
  );
  