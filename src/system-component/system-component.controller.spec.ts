import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentService } from './system-component.service';
import { SystemComponentController } from './system-component.controller';

jest.mock('./system-component.service');

const locId = 'some location id';
const sysId = 'some system id';

const data: SystemComponentDTO[] = [];
data.push(new SystemComponentDTO());
data.push(new SystemComponentDTO());

describe('SystemComponentController', () => {
  let controller: SystemComponentController;
  let service: SystemComponentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [SystemComponentController],
      providers: [SystemComponentService],
    }).compile();

    controller = module.get(SystemComponentController);
    service = module.get(SystemComponentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of system components', async () => {
      jest.spyOn(service, 'getComponents').mockResolvedValue(data);
      expect(await controller.getComponents(locId, sysId)).toBe(data);
    });
  });
});
