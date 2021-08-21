import { Component } from '../entities/component.entity';
import { ComponentMap } from './component.map';

const id = '';
const locationId = '';
const componentIdentifier = '';
const componentTypeCode = '';
const basisCode = '';
const modelVersion = '';
const manufacturer = '';
const serialNumber = '';
const hgConverterIndicator = 0;
const sampleAcquisitionMethodCode = '';

const entity = new Component();
entity.id = id;
entity.locationId = locationId;
entity.componentIdentifier = componentIdentifier;
entity.componentTypeCode = componentTypeCode;
entity.basisCode = basisCode;
entity.modelVersion = modelVersion;
entity.manufacturer = manufacturer;
entity.serialNumber = serialNumber;
entity.hgConverterIndicator = hgConverterIndicator;
entity.sampleAcquisitionMethodCode = sampleAcquisitionMethodCode;

describe('ComponentMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new ComponentMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.componentIdentifier).toEqual(componentIdentifier);
    expect(result.componentTypeCode).toEqual(componentTypeCode);
    expect(result.basisCode).toEqual(basisCode);
    expect(result.modelVersion).toEqual(modelVersion);
    expect(result.manufacturer).toEqual(manufacturer);
    expect(result.serialNumber).toEqual(serialNumber);
    expect(result.hgConverterIndicator).toEqual(hgConverterIndicator);
    expect(result.sampleAcquisitionMethodCode).toEqual(
      sampleAcquisitionMethodCode,
    );
  });
});
