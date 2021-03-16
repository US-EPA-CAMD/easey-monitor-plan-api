import { Test } from '@nestjs/testing';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';

const mockMatsMethodRepository = () => ({
    find: jest.fn(),
  });
  
  const mockMap = () => ({
    many: jest.fn(),
  });
  
  describe('-- Supplemental Methods Service --', () => {
    let supplementalMethodsService;
    let matsMethodRepository;
    let map;
  
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
            MonitorSystemService,
          {
            provide: MonitorSystemRepository,
            useFactory: mockMatsMethodRepository,
          },
          { provide: MonitorSystemMap, useFactory: mockMap },
        ],
      }).compile();
  
      supplementalMethodsService = module.get(MonitorSystemService);
      matsMethodRepository = module.get(MonitorSystemRepository);
  
      map = module.get(MonitorSystemMap);
    });
  
    describe('* getMatsMethods', () => {
      it('should return all the supplemental methods with the specified monLocId', async () => {
        map.many.mockReturnValue('mockSupplementalMethods');
  
        const monLocId = '123';
  
        let result = await supplementalMethodsService.getSystems(monLocId);
  
        expect(matsMethodRepository.find).toHaveBeenCalled();
        expect(map.many).toHaveBeenCalled();
        expect(result).toEqual('mockSupplementalMethods');
      });
    });
  });