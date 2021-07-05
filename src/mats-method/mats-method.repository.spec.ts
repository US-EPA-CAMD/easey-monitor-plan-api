// import { Test } from '@nestjs/testing';

// import { MatsMethodMap } from '../maps/mats-method.map';
// import { MatsMethodRepository } from './mats-method.repository';
// import { SupplementalMethodsService } from './mats-method.service';

// const mockMatsMethodRepository = () => ({
//   find: jest.fn(),
// });

// const mockMap = () => ({
//   many: jest.fn(),
// });

// describe('-- Supplemental Methods Repository --', () => {
//   let supplementalMethodsService;
//   let matsMethodRepository;
//   let map;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         SupplementalMethodsService,
//         {
//           provide: MatsMethodRepository,
//           useFactory: mockMatsMethodRepository,
//         },
//         { provide: MatsMethodMap, useFactory: mockMap },
//       ],
//     }).compile();

//     supplementalMethodsService = module.get(SupplementalMethodsService);
//     matsMethodRepository = module.get(MatsMethodRepository);

//     map = module.get(MatsMethodMap);
//   });

//   describe('* Methods', () => {
//     it('should return all the supplemental methods with the specified monLocId', async () => {
//       map.many.mockReturnValue('mockSupplementalMethods');

//       const monLocId = '123';

//       let result = await supplementalMethodsService.getMethods(monLocId);

//       expect(matsMethodRepository.find).toHaveBeenCalled();
//       expect(map.many).toHaveBeenCalled();
//       expect(result).toEqual('mockSupplementalMethods');
//     });
//   });
// });
