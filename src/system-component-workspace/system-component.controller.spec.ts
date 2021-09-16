import { Test, TestingModule } from '@nestjs/testing';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentWorkspaceService } from './system-component.service';
import { SystemComponentWorkspaceController } from './system-component.controller';

jest.mock('./system-component.service');

const locId = 'some location id';
const sysId = 'some system id';

const data: SystemComponentDTO[] = [];
data.push(new SystemComponentDTO());
data.push(new SystemComponentDTO());

describe('SystemComponentWorkspaceController', () => {
  let controller: SystemComponentWorkspaceController;
  let service: SystemComponentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemComponentWorkspaceController],
      providers: [SystemComponentWorkspaceService],
    }).compile();

    controller = module.get(SystemComponentWorkspaceController);
    service = module.get(SystemComponentWorkspaceService);
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