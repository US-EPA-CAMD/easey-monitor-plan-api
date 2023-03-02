import { Test } from "@nestjs/testing";
import { LoggingException } from "@us-epa-camd/easey-common/exceptions";
import { LoggerModule } from "@us-epa-camd/easey-common/logger";
import { MonitorSpan } from "../entities/monitor-span.entity";
import { ComponentWorkspaceRepository } from "../component-workspace/component.repository";
import { MonitorSpanBaseDTO } from "../dtos/monitor-span.dto";
import { MonitorSpanChecksService } from "./monitor-span-checks.service";


jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const locationId = "locationId"
const monitorSpan = new MonitorSpanBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new MonitorSpan()),

});

describe('Monitoring Span Check Service Test', () => {
    let service: MonitorSpanChecksService;
    let repository: ComponentWorkspaceRepository
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [LoggerModule, LoggingException],
        providers: [
          MonitorSpanChecksService,
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockRepository
        }
        ],
      }).compile();

      service = module.get(MonitorSpanChecksService)

      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG)
    })

    describe('SPAN-10 Checks', () => {
      it('Should get [SPAN-10-A] error', async () => {
        monitorSpan.endHour = null;
        monitorSpan.endDate = new Date();
  
        try {
          await service.runChecks(monitorSpan, locationId);
        } catch (err) {
          expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
        }
      });
    });
})