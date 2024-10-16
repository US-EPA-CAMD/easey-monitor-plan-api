import { HttpStatus } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { EntityManager, Repository } from 'typeorm';

export const getEarliestDate = (date1: Date | string, date2: Date | string) => {
  if (!date1) return date2;
  if (!date2) return date1;
  return new Date(date1) < new Date(date2) ? date1 : date2;
};

export const parseToken = (token: string) => {
  const obj = {
    userId: null,
    sessionId: null,
    expiration: null,
    clientIp: null,
  };

  const arr = token.split('&');
  arr.forEach(element => {
    const keyValue = element.split('=');
    obj[keyValue[0]] = keyValue[1];
  });

  return obj;
};

export function BeginEndDatesConsistent(
  validationOptions: BeginEndDatesConsistentOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'beginEndDatesConsistent',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        validationOptions.beginDate ? validationOptions.beginDate : 'beginDate',
        validationOptions.beginHour ? validationOptions.beginHour : 'beginHour',
        validationOptions.beginMinute
          ? validationOptions.beginMinute
          : 'beginMinute',
        validationOptions.endDate ? validationOptions.endDate : 'endDate',
        validationOptions.endHour ? validationOptions.endHour : 'endHour',
        validationOptions.endMinute ? validationOptions.endMinute : 'endMinute',
      ],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [
            beginDateField,
            beginHourField,
            beginMinuteField,
            endDateField,
            endHourField,
            endMinuteField,
          ] = args.constraints;

          // Can't validate when missing required field
          if (
            args.object[beginDateField] == null ||
            args.object[endDateField] == null
          )
            return true;

          const beginDate = new Date(args.object[beginDateField] + 'T00:00:00');
          if (args.object[beginHourField] !== undefined) {
            // Can't validate when missing required field
            if (args.object[beginHourField] == null) return true;

            beginDate.setHours(args.object[beginHourField]);
          }

          if (args.object[beginMinuteField] !== undefined) {
            // Can't validate when missing required field
            if (args.object[beginMinuteField] == null) return true;

            beginDate.setMinutes(args.object[beginMinuteField]);
          }

          const endDate = new Date(args.object[endDateField] + 'T00:00:00');
          if (args.object[endHourField] !== undefined) {
            // Can't validate when missing required field
            if (args.object[endHourField] == null) return true;

            endDate.setHours(args.object[endHourField]);
          }

          if (args.object[endMinuteField] !== undefined) {
            // Can't validate when missing required field
            if (args.object[endMinuteField] == null) return true;

            endDate.setMinutes(args.object[endMinuteField]);
          }

          return endDate >= beginDate;
        },
      },
    });
  };
}

export interface BeginEndDatesConsistentOptions extends ValidationOptions {
  beginDate?: string;
  beginHour?: string;
  beginMinute?: string;
  endDate?: string;
  endHour?: string;
  endMinute?: string;
}

export const throwIfErrors = (errorList: string[]) => {
  if (errorList.length > 0) {
    throw new EaseyException(
      new Error(JSON.stringify(errorList)),
      HttpStatus.BAD_REQUEST,
    );
  }
};

/**
 * Pass a transaction manager, if it exists, to a custom repository. If not, return the original repository.
 */
export function withTransaction<E, T extends Repository<E>>(
  repository: T,
  trx?: EntityManager,
) {
  if (!trx) return repository;

  const repositoryConstructor = repository.constructor as {
    new (manager: EntityManager): T;
  };

  const {
    target,
    manager,
    queryRunner,
    ...otherRepositoryProperties
  } = repository;

  return Object.assign(new repositoryConstructor(trx), {
    ...otherRepositoryProperties,
  });
}
