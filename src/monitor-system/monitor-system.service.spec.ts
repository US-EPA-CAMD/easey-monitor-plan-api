// import { Test } from '@nestjs/testing';
// import { ConfigService } from '@nestjs/config';
// import { MonitorSystemController } from './monitor-system.controller';
// import { MonitorSystemService } from './monitor-system.service';
// import { MonitorSystemRepository } from './monitor-system.repository';
// import { MonitorSystemMap } from '../maps/monitor-system.map';
// import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
// import { ComponentMap } from '../maps/component.map';
// import { MonitorSystemComponent } from '../entities/system-component.entity';
// import { SystemComponentMap } from '../maps/system-component.map';
// import { MonitorSystemComponentRepository } from './system-component.repository';
// import { ComponentRepository } from '../component/component.repository';

// import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
// import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
// import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';

// const mockConfigService = () => ({
//   get: jest.fn(),
// });

// describe('-- Monitoring system Service --', () => {
//   let supplementalMethodsController: MonitorSystemController;
//   let supplementalMethodsService: MonitorSystemService;
//   let MonSystemRepository: MonitorSystemRepository;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       controllers: [MonitorSystemController],
//       providers: [
//         MonitorSystemMap,
//         MonitorSystemService,
//         MonitorSystemRepository,
//         SystemFuelFlow,
//         MonitorSystemComponent,
//         SystemComponentMap,
//         ComponentMap,
//         SystemFuelFlowMap,
//         MonitorSystemComponentRepository,
//         ComponentRepository,
//         SystemFuelFlowRepository,
//         {
//           provide: ConfigService,
//           useFactory: mockConfigService,
//         },
//       ],
//     }).compile();

//     supplementalMethodsController = module.get(MonitorSystemController);
//     supplementalMethodsService = module.get(MonitorSystemService);
//     MonSystemRepository = module.get(MonitorSystemRepository);
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   describe('* getsMonitorSystem', () => {
//     it('should return a list of Monitoring Systems', async () => {
//       const expectedResult: MonitorSystemDTO[] = [];
//     });
//   });

//   function randocall(fn) {
//     return fn(Math.floor(Math.random() * 6 + 1));
//   }

//   test('randocall calls its callback with a number', () => {
//     const mock = jest.fn();
//     randocall(mock);
//     expect(mock).toBeCalledWith(expect.any(Number));
//   });

//   describe('* getsSystemComponent', () => {
//     it('should return a list of Monitoring components', async () => {
//       const expectedResult: MonitorSystemDTO[] = [];
//     });
//   });
//   describe('arrayContaining', () => {
//     const expected = ['Alice', 'Bob'];
//     it('matches even if received contains additional elements', () => {
//       expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
//     });
//     it('does not match if received does not contain expected elements', () => {
//       expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(expected));
//     });
//   });

//   describe('* getsSystemFuelFlow', () => {
//     it('should return a list of Monitoring fuel flows', async () => {
//       const expectedResult: MonitorSystemDTO[] = [];
//     });
//   });
// });
