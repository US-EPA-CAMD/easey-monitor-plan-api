import { Test, TestingModule } from '@nestjs/testing';

import { Component } from '../entities/component.entity';
import { ComponentMap } from './component.map';
import { AnalyzerRangeMap } from './analyzer-range.map';

const id = '';
const locationId = '';
const componentIdentifier = '';
const componentTypeCode = '';
const analyticalPrincipleCode = '';
const basisCode = '';
const modelVersion = '';
const manufacturer = '';
const serialNumber = '';
const hgConverterIndicator = 0;
const sampleAcquisitionMethodCode = '';

const entity = new Component();
entity.id = id;
entity.locationId = locationId;
entity.componentId = componentIdentifier;
entity.componentTypeCode = componentTypeCode;
entity.analyticalPrincipleCode = analyticalPrincipleCode;
entity.basisCode = basisCode;
entity.modelVersion = modelVersion;
entity.manufacturer = manufacturer;
entity.serialNumber = serialNumber;
entity.hgConverterIndicator = hgConverterIndicator;
entity.sampleAcquisitionMethodCode = sampleAcquisitionMethodCode;

describe('ComponentMap', () => {
  let map: ComponentMap;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [ComponentMap, AnalyzerRangeMap],
    }).compile();

    map = module.get(ComponentMap);
  });

  it('maps an entity to a dto', async () => {
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.componentId).toEqual(componentIdentifier);
    expect(result.componentTypeCode).toEqual(componentTypeCode);
    expect(result.analyticalPrincipleCode).toEqual(analyticalPrincipleCode);
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
