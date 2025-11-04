import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { Plant } from '../entities/plant.entity';
import { PlantRepository } from './plant.repository';
import { PlantService } from './plant.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
  findOneBy: jest.fn().mockResolvedValue(''),
});

jest.mock('@us-epa-camd/easey-common/check-catalog');

describe('Plant Import Tests', () => {
  let service: PlantService;
  let repository: PlantRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PlantService,
        {
          provide: PlantRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    repository = module.get(PlantRepository);
    service = module.get(PlantService);
  });

  describe('Check1', () => {
    it('Should error with no corresponding facility id', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      const testResult = await service.runPlantCheck(1);
      expect(testResult).toEqual([
        "[IMPORT1-FATAL-A] The database doesn't contain any Facility with Oris Code 1",
      ]);
    });

    it('Should pass with corresponding facility id', async () => {
      const plant = new Plant();
      plant.id = 3;
      repository.findOneBy = jest.fn().mockResolvedValue(plant);

      const testResult = await service.runPlantCheck(1);
      expect(testResult.length).toBe(0);
    });
  });

  describe('IMPORT-1-A and IMPORT-1-B checks', () => {
    it('should return IMPORT-1-A error', async () => {
      const plan = new UpdateMonitorPlanDTO();
      plan.orisCode = 12345;
      plan.monitoringLocationData = [];

      const result = await service.runImport1Checks(plan, null);

      expect(result).toContain(
        CheckCatalogService.formatResultMessage('IMPORT-1-A', {
          fieldname: 'orisCode',
          orisCode: 12345
        })
      );
    });

    it('should return IMPORT-1-B error', async () => {
      const plan = new UpdateMonitorPlanDTO();
      plan.orisCode = 12345;

      const location1 = new UpdateMonitorLocationDTO();
      location1.stackPipeId = 'STACK1';

      const location2 = new UpdateMonitorLocationDTO();
      location2.stackPipeId = 'STACK2'; 

      plan.monitoringLocationData = [location1, location2];

      const result = await service.runImport1Checks(plan, 1);

      expect(result).toContain(
        CheckCatalogService.formatResultMessage('IMPORT-1-B')
      );
    });
  });
});
