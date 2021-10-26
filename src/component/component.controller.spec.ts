import { Test, TestingModule } from '@nestjs/testing';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

jest.mock('./component.service');

const locId = 'some location id';

const data: ComponentDTO[] = [];
data.push(new ComponentDTO());
data.push(new ComponentDTO());

describe('ComponentController', () => {
  let controller: ComponentController;
  let service: ComponentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [ComponentController],
      providers: [ComponentService],
    }).compile();

    controller = module.get(ComponentController);
    service = module.get(ComponentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of components', async () => {
      jest.spyOn(service, 'getComponents').mockResolvedValue(data);
      expect(await controller.getComponents(locId)).toBe(data);
    });
  });
});
