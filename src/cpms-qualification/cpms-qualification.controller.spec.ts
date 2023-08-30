import { Test, TestingModule } from '@nestjs/testing';
import { CPMSQualificationController } from './cpms-qualification.controller';
import { CPMSQualificationService } from './cpms-qualification.service';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
import { HttpModule } from '@nestjs/axios';

const returnedCPMSQualification = new CPMSQualificationDTO();
const returnedCPMSQualifications = [returnedCPMSQualification];

const locId = '6';
const qualId = '1';

const mockService = () => ({
  getCPMSQualifications: jest
    .fn()
    .mockResolvedValue(returnedCPMSQualifications),
});

describe('CPMSQualificationController', () => {
  let controller: CPMSQualificationController;
  let service: CPMSQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CPMSQualificationController],
      providers: [
        {
          provide: CPMSQualificationService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<CPMSQualificationController>(
      CPMSQualificationController,
    );
    service = module.get<CPMSQualificationService>(CPMSQualificationService);
  });

  describe('getCPMSQualifications', () => {
    it('should return array of CPMS qualifications', async () => {
      jest
        .spyOn(service, 'getCPMSQualifications')
        .mockResolvedValue(returnedCPMSQualifications);
      expect(await controller.getCPMSQualifications(locId, qualId)).toBe(
        returnedCPMSQualifications,
      );
    });
  });
});
