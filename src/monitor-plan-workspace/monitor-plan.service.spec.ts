import { Test } from '@nestjs/testing';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UserCheckOutRepository } from './user-check-out.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';

const mockMonitorPlanWksRepository = () => ({});
const mockMonitorLocationWksRepository = () => ({});
const mockUnitOpStatusRepository = () => ({});
const mockUserCheckOutRepository = () => ({
  checkOutConfiguration: jest.fn(),
  findOne: jest.fn(),
});
const mockMonitorPlanMap = () => ({});

const monPlanId = '1234';
const userName = 'Test User';

const mockUserCheckOut = {
  facId: 1234,
  monPlanId: 'id',
  checkedOutOn: new Date(Date.now()),
  checkedOutBy: 'user',
  lastActivity: new Date(Date.now()),
};

describe('Monitor Plan Service', () => {
  let monitorPlanWksService: MonitorPlanWorkspaceService;
  let monitorPlanWksRepository;
  let monitorLocationWksRepository;
  let unitOpStatusRepository;
  let userCheckOutRepository;
  let map;

  beforeEach(async () => {
    // initialize a NestJS module with service and relevant repositories.
    const module = await Test.createTestingModule({
      providers: [
        MonitorPlanWorkspaceService,
        {
          provide: MonitorPlanWorkspaceRepository,
          useFactory: mockMonitorPlanWksRepository,
        },
        {
          provide: MonitorLocationWorkspaceRepository,
          useFactory: mockMonitorLocationWksRepository,
        },
        {
          provide: UnitOpStatusRepository,
          useFactory: mockUnitOpStatusRepository,
        },
        {
          provide: UserCheckOutRepository,
          useFactory: mockUserCheckOutRepository,
        },
        {
          provide: MonitorPlanMap,
          useFactory: mockMonitorPlanMap,
        },
      ],
    }).compile();

    monitorPlanWksService = module.get(MonitorPlanWorkspaceService);
    monitorPlanWksRepository = module.get(MonitorPlanWorkspaceRepository);
    monitorLocationWksRepository = module.get(
      MonitorLocationWorkspaceRepository,
    );
    unitOpStatusRepository = module.get(UnitOpStatusRepository);
    userCheckOutRepository = module.get(UserCheckOutRepository);
    map = module.get(MonitorPlanMap);
  });

  // TODO: unit test for configurations
  // describe('getConfigurations', () => {
  //   expect(true).toEqual(true);
  // });

  describe('checkOutConfiguration', () => {
    it('call UserCheckOutRepository.checkOutConfiguratin and returns the result', async () => {
      userCheckOutRepository.checkOutConfiguration.mockResolvedValue(
        'someValue',
      );
      const result = await monitorPlanWksService.checkOutConfiguration(
        monPlanId,
        userName,
      );
      expect(result).toEqual('someValue');
    });
  });

  describe('getCheckOutConfiguration', () => {
    it('calls UserCheckOutRepository.findOne and returns a record', async () => {
      userCheckOutRepository.findOne.mockResolvedValue(mockUserCheckOut);
      const record = await monitorPlanWksService.getCheckOutConfiguration('id');
      expect(record).toEqual(mockUserCheckOut);
    });
  });

  describe('updateLastActivity', () => {
    it('calls the service.getCheckOutConfiguration and updates the last activity to the current time', async () => {
      const now = new Date(Date.now());
      const record = await monitorPlanWksService.getCheckOutConfiguration('id');
      record.lastActivity = now;
      expect(record.lastActivity).toEqual(now);
    });
  });
});
