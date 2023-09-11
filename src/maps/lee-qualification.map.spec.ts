import { LEEQualification } from '../entities/lee-qualification.entity';
import { LEEQualificationMap } from './lee-qualification.map';

const id = '1';
const qualId = '1';
const userId = 'testuser';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());

const qualificationTestDate = new Date(Date.now());
const parameterCode = 'HG';
const qualificationTestType = 'INITIAL';
const potentialAnnualMassEmissions = null;
const applicableEmissionStandard = 1.2;
const unitsofStandard = 'LBTBTU';
const percentageOfEmissionStandard = 1.4;

const entity = new LEEQualification();
entity.id = id;
entity.qualificationId = qualId;
entity.parameterCode = parameterCode;
entity.qualificationTestType = qualificationTestType;
entity.qualificationTestDate = qualificationTestDate;
entity.potentialAnnualMassEmissions = potentialAnnualMassEmissions;
entity.applicableEmissionStandard = applicableEmissionStandard;
entity.unitsofStandard = unitsofStandard;
entity.percentageOfEmissionStandard = percentageOfEmissionStandard;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;

describe('LEEQualificationMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new LEEQualificationMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.qualificationId).toEqual(qualId);
    expect(result.parameterCode).toEqual(parameterCode);
    expect(result.qualificationTestType).toEqual(qualificationTestType);
    expect(result.qualificationTestDate).toEqual(qualificationTestDate);
    expect(result.potentialAnnualMassEmissions).toEqual(
      potentialAnnualMassEmissions,
    );
    expect(result.unitsofStandard).toEqual(unitsofStandard);
    expect(result.percentageOfEmissionStandard).toEqual(
      percentageOfEmissionStandard,
    );
  });
});
