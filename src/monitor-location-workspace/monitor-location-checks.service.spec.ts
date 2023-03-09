import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { MonitorLocationChecksService } from './monitor-location-checks.service';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { Unit } from '../entities/workspace/unit.entity';

describe('location checks service tests', () => {
  let service: MonitorLocationChecksService;
  let repository: any;

  const mockRepository = () => ({
    getLocationsByUnitStackPipeIds: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorLocationChecksService,
        {
          provide: MonitorLocationWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorLocationChecksService);
    repository = module.get(MonitorLocationWorkspaceRepository);
  });

  describe('processLocations tests', () => {
    const payload = new UpdateMonitorPlanDTO();

    const location = new UpdateMonitorLocationDTO();
    location.unitId = '51';
    payload.locations = [location];
    it('is able to return weith expected values', () => {
      const result = service.processLocations(payload);

      expect(result[0].unitId).toEqual('51');
    });
  });

  describe('runChecks tests', () => {
    const baseLocations: LocationIdentifiers[] = [
      {
        unitId: '51',
        locationId: '1',
        stackPipeId: null,
      },
    ];

    const payload = new UpdateMonitorPlanDTO();
    payload.orisCode = 1;
    const location = new UpdateMonitorLocationDTO();
    location.unitId = '51';
    payload.locations = [location];

    it('returns a response successfully', async () => {
      const loc = new MonitorLocation();
      loc.id = '1';
      loc.unit = new Unit();
      loc.unit.name = '51';
      loc.stackPipe = null;

      jest
        .spyOn(repository, 'getLocationsByUnitStackPipeIds')
        .mockResolvedValue([loc]);

      jest.spyOn(service, 'processLocations').mockReturnValue(baseLocations);

      const result = await service.runChecks(payload);

      expect(result).not.toBeNull();
      expect(result[0]).toBe(baseLocations);
      expect(result[1]).toEqual([]);
    });
  });
});
