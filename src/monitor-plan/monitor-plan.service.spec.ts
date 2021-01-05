// import { Test } from '@nestjs/testing';
// import { MonitorPlanService } from './monitor-plan.service';
// import { MonitorPlanRepository } from './monitor-plan.repository';
// import { MonitorPlanParamsDTO } from 'src/dtos/monitor-plan-params.dto';
// import { MonitorPlanDTO } from 'src/dtos/monitor-plan.dto';

// const mockMonitorPlanRepository = () => ({
//   getMonitorPlan: jest.fn(),
// });

// describe('MonitorPlanService', () => {
//   let monitorPlanService;
//   let monitorPlanRepository;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         MonitorPlanService,
//         {
//           provide: MonitorPlanRepository,
//           useFactory: mockMonitorPlanRepository,
//         },
//       ],
//     }).compile();

//     monitorPlanService = module.get<MonitorPlanService>(MonitorPlanService);
//     monitorPlanRepository = module.get<MonitorPlanRepository>(
//       MonitorPlanRepository,
//     );
//   });

//   describe('getMonitorPlan', () => {
//     it('calls MonitorPlanRepository.getMonitorPlan() and gets all the monitor plans for a particular facility', async () => {
//       const monitorPlan: Array<MonitorPlanDTO> = [
//         new MonitorPlanDTO('1', '1A', undefined, undefined, true),
//         new MonitorPlanDTO('2', '2A', undefined, undefined, true),
//         new MonitorPlanDTO('3', '3A', undefined, undefined, true),
//         new MonitorPlanDTO('4', '4A', undefined, undefined, true),
//       ];
//       monitorPlanRepository.getMonitorPlan.mockReturnValue(monitorPlan);

//       const request = {
//         res: {
//           setHeader: jest.fn(),
//         },
//       };
//       request.res.setHeader.mockReturnValue('some response');

//       const params: MonitorPlanParamsDTO = {
//         facId: undefined,
//         orisCode: undefined,
//         active: true,
//         page: 2,
//         perPage: 2,
//         orderBy: undefined,
//       };

//       expect(monitorPlanRepository.getMonitorPlan).not.toHaveBeenCalled();
//       const result = monitorPlanService.getMonitorPlan(params, request);

//       expect(monitorPlanRepository.getMonitorPlan).toHaveBeenCalled();
//       expect(result).toEqual(monitorPlan.slice(2, 4));
//     });
//   });
// });
