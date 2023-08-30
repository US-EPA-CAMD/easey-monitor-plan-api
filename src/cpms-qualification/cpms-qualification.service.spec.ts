import { Test, TestingModule } from '@nestjs/testing';
import { CPMSQualificationService } from './cpms-qualification.service';
import { CPMSQualificationRepository } from './cpms-qualification.repository';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
import { CPMSQualification } from '../entities/cpms-qualification.entity';

const cpmsQualificationDto: CPMSQualificationDTO = new CPMSQualificationDTO();
const cpmsQualification: CPMSQualification = new CPMSQualification();

const mockRepository = () => ({
  getCPMSQualifications: jest.fn().mockResolvedValue([cpmsQualification]),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([cpmsQualificationDto]),
});

describe('CPMSQualificationService', () => {
  let service: CPMSQualificationService;
  let repository: CPMSQualificationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CPMSQualificationService,
        {
          provide: CPMSQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: CPMSQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<CPMSQualificationService>(CPMSQualificationService);
    repository = module.get<CPMSQualificationRepository>(
      CPMSQualificationRepository,
    );
  });

  describe('getCPMSQualifications', () => {
    it('should return array of CPMS qualifications', async () => {
      const result = await service.getCPMSQualifications('1', '1');
      expect(result).toEqual([cpmsQualificationDto]);
    });
  });
});
