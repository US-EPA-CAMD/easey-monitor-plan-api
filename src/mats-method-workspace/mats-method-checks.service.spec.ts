import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { MatsMethodChecksService } from './mats-method-checks.service';
import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MAXIMUM_FUTURE_DATE } from '../utilities/constants';
const moment = require('moment');

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const payload = new MatsMethodBaseDTO();

describe('Mats Method Checks Service Test', () => {
  let service: MatsMethodChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [MatsMethodChecksService],
    }).compile();

    service = module.get(MatsMethodChecksService);
  });

  describe('MATSMTH-4 Checks', () => {
    it('Should get [MATSMTH-4-C] error', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.endHour = null;
      payload.endDate = new Date();

      let errored = false;

      try {
        await service.runChecks(payload, false, false);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual(JSON.stringify([MOCK_ERROR_MSG]));
      }
      expect(errored).toEqual(true);
    });
  });

  describe('MATSMTH-3 Checks', () => {
    it('Should get [MATSMTH-3-A] error', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.beginDate = new Date('2023-02-28');
      payload.beginHour = 5;
      payload.endDate = new Date('2023-02-28');
      payload.endHour = 1;

      let errored = false;

      try {
        await service.runChecks(payload, false, false);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual(JSON.stringify([MOCK_ERROR_MSG]));
      }
      expect(errored).toEqual(true);
    });

    it('Should get [MATSMTH-3-B] error', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.beginDate = new Date('2023-02-28');
      payload.beginHour = 5;
      payload.endDate = moment(MAXIMUM_FUTURE_DATE).add(1, 'days');
      payload.endHour = 1;

      let errored = false;

      try {
        await service.runChecks(payload, false, false);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual(JSON.stringify([MOCK_ERROR_MSG]));
      }
      expect(errored).toEqual(true);
    });
  });

  describe('MATSMTH-5 Checks', () => {
    it('Should get [MATSMTH-5-A] error', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValueOnce(MOCK_ERROR_MSG);

      payload.beginDate = new Date('2023-02-28');
      payload.beginHour = 5;
      payload.endDate = new Date('2023-02-28');
      payload.endHour = 1;

      let errored = false;

      try {
        await service.runChecks(payload, false, false);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual(JSON.stringify([MOCK_ERROR_MSG]));
      }
      expect(errored).toEqual(true);
    });
  });
});
