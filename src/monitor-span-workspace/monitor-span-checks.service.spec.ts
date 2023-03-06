import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorSpan } from '../entities/monitor-span.entity';
import { MonitorSpanBaseDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanChecksService } from './monitor-span-checks.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const locationId = 'locationId';
const monitorSpan = new MonitorSpanBaseDTO();

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue([new MonitorSpan()]),
});

describe('Monitoring Span Check Service Test', () => {
  let service: MonitorSpanChecksService;
  let repository: MonitorSpanWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        MonitorSpanChecksService,
        {
          provide: MonitorSpanWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorSpanChecksService);
    repository = module.get(MonitorSpanWorkspaceRepository);
    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Monitor Span Checks Service', () => {
    it('Should Call Component Repository findOne', async () => {
      await service.runChecks(monitorSpan, locationId);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });
});
