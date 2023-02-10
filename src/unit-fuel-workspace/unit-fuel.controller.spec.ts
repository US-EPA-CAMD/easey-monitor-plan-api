import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelWorkspaceController } from './unit-fuel.controller';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { UnitFuelBaseDTO } from '../dtos/unit-fuel.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

jest.mock('./unit-fuel.service');

const locId = '6';
const unitRecordId = 1;
const unitFuelId = 'some unit fuel id';
const payload = new UnitFuelBaseDTO();

const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};

const returnedUnitFuels: UnitFuelDTO[] = [];
returnedUnitFuels.push(new UnitFuelDTO());

const returnedLoad = new UnitFuelDTO();

describe('UnitFuelWorkspaceController', () => {
  let controller: UnitFuelWorkspaceController;
  let service: UnitFuelWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [UnitFuelWorkspaceController],
      providers: [UnitFuelWorkspaceService, ConfigService, AuthGuard],
    }).compile();

    controller = module.get(UnitFuelWorkspaceController);
    service = module.get(UnitFuelWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitFuels', () => {
    it('should return array of unit fuels', async () => {
      jest.spyOn(service, 'getUnitFuels').mockResolvedValue(returnedUnitFuels);
      expect(await controller.getUnitFuels(locId, unitRecordId)).toBe(
        returnedUnitFuels,
      );
    });
  });

  describe('updateUnitFuel', () => {
    it('should return updated unit fuel', async () => {
      jest.spyOn(service, 'updateUnitFuel').mockResolvedValue(returnedLoad);
      expect(
        await controller.updateUnitFuel(
          locId,
          unitRecordId,
          unitFuelId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });

  describe('createUnitFuel', () => {
    it('should return the created unit fuel record', async () => {
      jest.spyOn(service, 'createUnitFuel').mockResolvedValue(returnedLoad);
      expect(
        await controller.createUnitFuel(
          locId,
          unitRecordId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });
});
