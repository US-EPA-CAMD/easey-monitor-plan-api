import { Repository, EntityRepository } from 'typeorm';

import { LinkDTO } from 'src/dtos/link.dto';
import { MonitorPlanDTO } from 'src/dtos/monitor-plan.dto';
import { MonitorPlan } from 'src/entities/monitor-plan.entity';
import { MonitorPlanParamsDTO } from 'src/dtos/monitor-plan-params.dto';
import { MonitorLocationDTO } from 'src/dtos/monitor-location.dto';
import { NotFoundException } from '@nestjs/common';

function createMonitorPlanLinks(id: string): LinkDTO[] {
  const links: Array<LinkDTO> = [new LinkDTO('self', `/monitor-plans/${id}`)];
  return links;
}

function createMonitorLocationLinks(id: string): LinkDTO[] {
  const links: Array<LinkDTO> = [
    new LinkDTO('self', `/monitor-locations/${id}`),
    new LinkDTO('methods', `/monitor-locations/${id}/methods`),
    new LinkDTO('systems', `/monitor-locations/${id}/systems`),
    new LinkDTO('spans', `/monitor-locations/${id}/spans`),
  ];

  return links;
}

// static data
const monitorLocation1: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    'BZ5461',
    '1',
    'Unit',
    createMonitorLocationLinks('BZ5461'),
  ),
  new MonitorLocationDTO(
    'M7B4N2',
    '2',
    'Unit',
    createMonitorLocationLinks('M7B4N2'),
  ),
  new MonitorLocationDTO(
    'BXMKQN',
    'CS0AAN',
    'Stack',
    createMonitorLocationLinks('BXMKQN'),
  ),
];
const monitorLocation2: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    'MKNOX2',
    '4',
    'Unit',
    createMonitorLocationLinks('MKNOX2'),
  ),
];
const monitorLocation3: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    'CSQHU7',
    '5',
    'Unit',
    createMonitorLocationLinks('CSQHU7'),
  ),
];
const monitorLocation4: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    'TE980R',
    '6A',
    'Unit',
    createMonitorLocationLinks('TE980R'),
  ),
];
const monitorLocation5: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    '6I56AR',
    '6B',
    'Unit',
    createMonitorLocationLinks('6I56AR'),
  ),
];
const monitorLocation6: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    '0L542L',
    '7A',
    'Unit',
    createMonitorLocationLinks('0L542L'),
  ),
];
const monitorLocation7: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    '3502D3',
    '7B',
    'Unit',
    createMonitorLocationLinks('3502D3'),
  ),
];
const monitorLocation8: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    'B4HYTX',
    '1',
    'Unit',
    createMonitorLocationLinks('B4HYTX'),
  ),
  new MonitorLocationDTO(
    'Z1RDUG',
    '2',
    'Unit',
    createMonitorLocationLinks('Z1RDUG'),
  ),
  new MonitorLocationDTO(
    '322T6Z',
    '3',
    'Unit',
    createMonitorLocationLinks('322T6Z'),
  ),
  new MonitorLocationDTO(
    'F0EER8',
    'CS0AAN',
    'Stack',
    createMonitorLocationLinks('F0EER8'),
  ),
];
const monitorLocation9: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    '19ZTDI',
    '4',
    'Unit',
    createMonitorLocationLinks('19ZTDI'),
  ),
  new MonitorLocationDTO(
    'M4SO8S',
    'MS4A',
    'Stack',
    createMonitorLocationLinks('M4SO8S'),
  ),
  new MonitorLocationDTO(
    'KK3F5X',
    'MS4B',
    'Stack',
    createMonitorLocationLinks('KK3F5X'),
  ),
];

const monitorLocation10: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    'V177N4',
    'CTG-1',
    'Unit',
    createMonitorLocationLinks('V177N4'),
  ),
];

const monitorLocation11: Array<MonitorLocationDTO> = [
  new MonitorLocationDTO(
    'TLSBVN',
    '1',
    'Unit',
    createMonitorLocationLinks('TLSBVN'),
  ),
];

// static data for facility with orisCode = 3
const monitorPlansFacility1: Array<MonitorPlanDTO> = [
  new MonitorPlanDTO(
    'MDC-DSF87364AD9879A8FDS7G',
    '1, 2, CS0AAN',
    monitorLocation1,
    createMonitorPlanLinks('MDC-DSF87364AD9879A8FDS7G'),
    true,
  ),
  new MonitorPlanDTO(
    'MDC-M4KQ3KVXJ35OKVLA5UYW1',
    '4',
    monitorLocation2,
    createMonitorPlanLinks('MDC-M4KQ3KVXJ35OKVLA5UYW1'),
    true,
  ),
  new MonitorPlanDTO(
    'MDC-JN2QTRBCFBF6LQ91YOUG2',
    '5',
    monitorLocation3,
    createMonitorPlanLinks('MDC-JN2QTRBCFBF6LQ91YOUG2'),
    true,
  ),
  new MonitorPlanDTO(
    'MDC-1OKIUEA548R510EIWZEC3',
    '6A',
    monitorLocation4,
    createMonitorPlanLinks('MDC-1OKIUEA548R510EIWZEC3'),
    true,
  ),
  new MonitorPlanDTO(
    'MDC-4V2LQSNVXN429LB9MN6T4',
    '6B',
    monitorLocation5,
    createMonitorPlanLinks('MDC-4V2LQSNVXN429LB9MN6T4'),
    true,
  ),
  new MonitorPlanDTO(
    'MDC-GX4CAAKVVFXTGIR78QM55',
    '7A',
    monitorLocation6,
    createMonitorPlanLinks('MDC-GX4CAAKVVFXTGIR78QM55'),
    true,
  ),
  new MonitorPlanDTO(
    'MDC-EXOV28PUJVZ94W9MY5YU6',
    '7B',
    monitorLocation7,
    createMonitorPlanLinks('MDC-EXOV28PUJVZ94W9MY5YU6'),
    true,
  ),
  new MonitorPlanDTO(
    'MDC-MF5YOLEY3O78LTRMRIQP7',
    '1, 2, 3, CS0AAN',
    monitorLocation8,
    createMonitorPlanLinks('MDC-MF5YOLEY3O78LTRMRIQP7'),
    false,
  ),
  new MonitorPlanDTO(
    'MDC-8UH3RMFKAUB2PCQCJ52F8',
    '4, MS4A, MS4B',
    monitorLocation9,
    createMonitorPlanLinks('MDC-8UH3RMFKAUB2PCQCJ52F8'),
    false,
  ),
];

// static data for facility with orisCode = 9
const monitorPlansFacility2: Array<MonitorPlanDTO> = [
  new MonitorPlanDTO(
    'MDC-SXI4SNK1X2R2862XBRAY1',
    'CTG-1',
    monitorLocation10,
    createMonitorPlanLinks('MDC-SXI4SNK1X2R2862XBRAY1'),
    true,
  ),
];

// static data for facility with orisCode = 51
const monitorPlansFacility3: Array<MonitorPlanDTO> = [
  new MonitorPlanDTO(
    'MDC-2WF59ZGNX40AD96KB6HU1',
    '1',
    monitorLocation11,
    createMonitorPlanLinks('MDC-2WF59ZGNX40AD96KB6HU1'),
    true,
  ),
];

//sort by id, name, and active
export function sortMonitorPlan(orderBy: string): any {
  return (monitorPlan1: MonitorPlanDTO, monitorPlan2: MonitorPlanDTO) => {
    switch (orderBy) {
      case 'id':
        return monitorPlan1.id < monitorPlan2.id
          ? -1
          : monitorPlan1.id > monitorPlan2.id
          ? 1
          : 0;
      case 'name':
        return monitorPlan1.name < monitorPlan2.name
          ? -1
          : monitorPlan1.name > monitorPlan2.name
          ? 1
          : 0;
      //active = true first
      case 'active':
        return monitorPlan1.active > monitorPlan2.active
          ? -1
          : monitorPlan1.active < monitorPlan2.active
          ? 1
          : 0;
    }
  };
}

@EntityRepository(MonitorPlan)
export class MonitorPlanRepository extends Repository<MonitorPlan> {
  getMonitorPlan(monitorPlanParamsDTO: MonitorPlanParamsDTO): MonitorPlanDTO[] {
    const { orisCode, facId, orderBy, active } = monitorPlanParamsDTO;

    let monitorPlanArray: Array<MonitorPlanDTO>;
    if (+orisCode === +3 || +facId === +1) {
      monitorPlanArray = monitorPlansFacility1;
    } else if (+orisCode === +9 || +facId === +2) {
      monitorPlanArray = monitorPlansFacility2;
    } else if (+orisCode === +51 || +facId === +3) {
      monitorPlanArray = monitorPlansFacility3;
    } else if (
      +orisCode === +87 ||
      +orisCode === +108 ||
      +orisCode === +113 ||
      +orisCode === +130 ||
      +orisCode === +477 ||
      +orisCode === +564 ||
      +orisCode === +596
    ) {
      monitorPlanArray = []; // returns empty list for facilities with no monitor plan static data
    } else {
      throw new NotFoundException();
    }

    if (orderBy) {
      monitorPlanArray = monitorPlanArray.sort(sortMonitorPlan(orderBy));
    }

    if (active) {
      monitorPlanArray = monitorPlanArray.filter(
        x => String(x.active) === String(active),
      );
    }

    return monitorPlanArray;
  }
}
