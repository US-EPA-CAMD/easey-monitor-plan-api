import { Component } from '../entities/component.entity';
import { ComponentMap } from './component.map';

const id = '';
const monLocId = '';
const componentIdentifier = '';
const componentTypeCode = '';
const basisCode = '';
const modelVersion = '';
const manufacturer = '';
const serialNumber = '';
const hgConverterInd = 0;
const acquisitionMethodCode = '';

const entity = new Component();
entity.id = id;
entity.monLocId = monLocId;
entity.componentIdentifier = componentIdentifier;
entity.componentTypeCode = componentTypeCode;
entity.basisCode = basisCode;
entity.modelVersion = modelVersion;
entity.manufacturer = manufacturer;
entity.serialNumber = serialNumber;
entity.hgConverterInd = hgConverterInd;
entity.acquisitionMethodCode = acquisitionMethodCode;

describe('ComponentMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new ComponentMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.monLocId).toEqual(monLocId);
    expect(result.componentIdentifier).toEqual(componentIdentifier);
    expect(result.componentTypeCode).toEqual(componentTypeCode);
    expect(result.basisCode).toEqual(basisCode);
    expect(result.modelVersion).toEqual(modelVersion);
    expect(result.manufacturer).toEqual(manufacturer);
    expect(result.serialNumber).toEqual(serialNumber);
    expect(result.hgConverterInd).toEqual(hgConverterInd);
    expect(result.acquisitionMethodCode).toEqual(acquisitionMethodCode);
  });
});
