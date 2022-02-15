import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeController } from './monitor-attribute.controller';
import { MonitorAttributeService } from './monitor-attribute.service';

const locationId = 'someLocId';

jest.mock('./monitor-attribute.service');

describe('MonitorAttributeController', () => {
  let controller: MonitorAttributeController;
  let service: MonitorAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [MonitorAttributeController],
      providers: [MonitorAttributeService],
    }).compile();

    controller = module.get<MonitorAttributeController>(
      MonitorAttributeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAttributes', () => {
    it('should call the service get attributes method', () => {
      controller.getAttributes(locationId);
      expect(service.getAttributes).toHaveBeenCalled();
    });
  });
});
