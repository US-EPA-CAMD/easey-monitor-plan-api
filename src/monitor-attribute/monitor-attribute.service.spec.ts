import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeService } from './monitor-attribute.service';
import { MonitorAttributeRepository } from './monitor-attribute.repository';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';

const attribute = new MonitorAttributeDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([attribute]),
});

const mockMonitorAttributeMap = () => ({
  one: jest.fn().mockResolvedValue(attribute),
  many: jest.fn().mockResolvedValue([attribute]),
});

const locationId = 'string';

describe('MonitorAttributeService', () => {
  let service: MonitorAttributeService;
  let repository: MonitorAttributeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        MonitorAttributeService,
        {
          provide: MonitorAttributeRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorAttributeMap,
          useFactory: mockMonitorAttributeMap,
        },
      ],
    }).compile();

    service = module.get<MonitorAttributeService>(MonitorAttributeService);
    repository = module.get<MonitorAttributeRepository>(
      MonitorAttributeRepository,
    );
  });

  describe('getAttributes', () => {
    it('should return array of location attributes', async () => {
      const result = await service.getAttributes(locationId);
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([attribute]);
    });
  });
});
