import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { MatsMethodChecksService } from './mats-method-checks.service';
import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const payload = new MatsMethodBaseDTO();

describe('Mats Method Checks Service Test', () => {
  let service: MatsMethodChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [MatsMethodChecksService],
    }).compile();

    service = module.get(MatsMethodChecksService);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('MATSMTH-4 Checks', () => {
    it('Should get [MATSMTH-4-C] error', async () => {
      payload.endHour = null;
      payload.endDate = new Date();

      try {
        await service.runChecks(payload, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('MATSMTH-3 Checks', () => {
    it('Should get [MATSMTH-3-A] error', async () => {
      payload.beginDate = new Date('2023-02-28');
      payload.beginHour = 5;
      payload.endDate = new Date('2023-02-28');
      payload.endHour = 1;

      try {
        await service.runChecks(payload, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [MATSMTH-3-B] error', async () => {
      payload.beginDate = new Date('2023-02-28');
      payload.beginHour = 5;
      payload.endDate = new Date('2023-04-28');
      payload.endHour = 1;

      try {
        await service.runChecks(payload, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
