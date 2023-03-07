import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlWorkspaceController } from './unit-control.controller';
import { UnitControlWorkspaceService } from './unit-control.service';
import { UnitControlBaseDTO } from '../dtos/unit-control.dto';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { UnitControlChecksService } from './unit-control-checks.service';

jest.mock('./unit-control.service');

const locId = '6';
const unitRecordId = 1;
const unitControlId = 'some unit control id';
const payload = new UnitControlBaseDTO();

const returnedUnitControls: UnitControlDTO[] = [];
returnedUnitControls.push(new UnitControlDTO());
const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};

const returnedLoad = new UnitControlDTO();

describe('UnitControlWorkspaceController', () => {
  let controller: UnitControlWorkspaceController;
  let service: UnitControlWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [UnitControlWorkspaceController],
      providers: [
        UnitControlWorkspaceService,
        ConfigService,
        AuthGuard,
        {
          provide: UnitControlChecksService,
          useFactory: () => ({
            runChecks: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get(UnitControlWorkspaceController);
    service = module.get(UnitControlWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnitControls', () => {
    it('should return array of unit controls', async () => {
      jest
        .spyOn(service, 'getUnitControls')
        .mockResolvedValue(returnedUnitControls);
      expect(await controller.getUnitControls(locId, unitRecordId)).toBe(
        returnedUnitControls,
      );
    });
  });

  describe('updateUnitControl', () => {
    it('should return updated unit control', async () => {
      jest.spyOn(service, 'updateUnitControl').mockResolvedValue(returnedLoad);
      expect(
        await controller.updateUnitControl(
          locId,
          unitRecordId,
          unitControlId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });

  describe('createUnitControl', () => {
    it('should return the created unit control record', async () => {
      jest.spyOn(service, 'createUnitControl').mockResolvedValue(returnedLoad);
      expect(
        await controller.createUnitControl(
          locId,
          unitRecordId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });
});
