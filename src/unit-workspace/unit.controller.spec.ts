import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitWorkspaceService } from './unit.service';
import { UnitDTO, UnitBaseDTO } from '../dtos/unit.dto';
import { UnitWorkspaceController } from './unit.controller';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

jest.mock('./unit.service');

const locId = 'some location id';
const unitId = 1;

const data: UnitDTO[] = [];
data.push(new UnitDTO());
data.push(new UnitDTO());

describe('UnitWorkspaceController', () => {
  let controller: UnitWorkspaceController;
  let service: UnitWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [UnitWorkspaceController],
      providers: [
        UnitWorkspaceService,
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(UnitWorkspaceController);
    service = module.get(UnitWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnits', () => {
    it('should return array of workspace units', async () => {
      jest.spyOn(service, 'getUnits').mockResolvedValue(data);
      expect(await controller.getUnits('locId', unitId)).toBe(data);
    });
  });

  describe('updateUnit', () => {
    it('should return the updated unit', async () => {
      const payload = new UnitBaseDTO();
      const updatedUnit = new UnitDTO();

      const user: CurrentUser = {
        userId: '',
        sessionId: '',
        expiration: '',
        clientIp: '',
        facilities: [],
        roles: [],
      };

      jest.spyOn(service, 'updateUnit').mockResolvedValue(updatedUnit);
      expect(await controller.updateUnit('locId', unitId, payload, user)).toBe(
        updatedUnit,
      );
    });
  });
});
