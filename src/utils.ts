import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { EntityManager, Repository } from 'typeorm';

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

export function withTransaction<E, T extends Repository<E>>(
  repository: T,
  trx?: EntityManager,
) {
  return trx?.withRepository(repository) ?? repository;
}
