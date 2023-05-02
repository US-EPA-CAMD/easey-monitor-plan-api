import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitCapacityBaseDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceController } from './unit-capacity.controller';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

jest.mock('./unit-capacity.service');

const locId = '6';
const unitRecordId = 1;
const id = '1';
const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const payload = new UnitCapacityBaseDTO();

const returnedUnitCapacities: UnitCapacityDTO[] = [];
returnedUnitCapacities.push(new UnitCapacityDTO());
returnedUnitCapacities.push(new UnitCapacityDTO());

const returnedUnitCapacity = new UnitCapacityDTO();

describe('UnitCapacityController', () => {
  let controller: UnitCapacityWorkspaceController;
  let service: UnitCapacityWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [UnitCapacityWorkspaceController],
      providers: [UnitCapacityWorkspaceService, ConfigService, AuthGuard],
    }).compile();

    controller = module.get(UnitCapacityWorkspaceController);
    service = module.get(UnitCapacityWorkspaceService);
  });

  describe('getUnitCapacities', () => {
    it('should return array of unit capacitys', async () => {
      jest
        .spyOn(service, 'getUnitCapacities')
        .mockResolvedValue(returnedUnitCapacities);
      expect(await controller.getUnitCapacities(locId, unitRecordId)).toBe(
        returnedUnitCapacities,
      );
    });
  });

  describe('createUnitCapacity', () => {
    it('should return the created unit capacity record', async () => {
      jest
        .spyOn(service, 'createUnitCapacity')
        .mockResolvedValue(returnedUnitCapacity);
      expect(
        await controller.createUnitCapcity(
          locId,
          unitRecordId,
          payload,
          currentUser,
        ),
      ).toBe(returnedUnitCapacity);
    });
  });

  describe('updateUnitCapacity', () => {
    it('should return updated unit capacity', async () => {
      jest
        .spyOn(service, 'updateUnitCapacity')
        .mockResolvedValue(returnedUnitCapacity);
      expect(
        await controller.updateUnitCapacity(
          locId,
          unitRecordId,
          id,
          payload,
          currentUser,
        ),
      ).toBe(returnedUnitCapacity);
    });
  });
});
