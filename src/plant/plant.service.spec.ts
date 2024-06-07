import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { Plant } from '../entities/plant.entity';
import { PlantRepository } from './plant.repository';
import { PlantService } from './plant.service';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
  findOneBy: jest.fn().mockResolvedValue(''),
});

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
});
