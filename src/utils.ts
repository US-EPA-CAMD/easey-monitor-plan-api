import { HttpStatus } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import {
  BaseEntity,
  EntityManager,
  FindOptionsRelations,
  Repository,
} from 'typeorm';

export const getEarliestDate = (date1: Date | string, date2: Date | string) => {
  if (!date1) return date2;
  if (!date2) return date1;
  return new Date(date1) < new Date(date2) ? date1 : date2;
};

export const hasRequiredRelations = <T extends BaseEntity>(
  obj: unknown,
  requiredStructure: FindOptionsRelations<T>,
) => {
  if (typeof obj !== 'object' || obj === null) return false;

  for (const key in requiredStructure) {
    if (!(key in obj)) {
      return false; // Missing required property
    }

    const schemaValue = requiredStructure[key];
    const objValue = (obj as Record<string, unknown>)[key];

    if (typeof schemaValue === 'object' && schemaValue !== null) {
      if (!hasRequiredRelations(objValue, schemaValue)) {
        return false;
      }
    }
  }

  return true; // All required properties exist
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
 * Wrapper around `Promise.allSettled` that throws an error if any promises are rejected (as a JSON stringified array of error messages).
 */
export const settlePromises = async <T>(promises: Array<Promise<T>>) => {
  const { values, errors } = (await Promise.allSettled(promises)).reduce<{
    values: T[];
    errors: unknown[];
  }>(
    (acc, result) => {
      if (result.status === 'fulfilled') {
        acc.values.push(result.value);
      } else {
        let reason = result.reason;
        try {
          // If the reason is already a JSON string, parse it.
          const parsed = JSON.parse(reason.message);
          // If it's an array, flatten it; otherwise, wrap it in an array.
          reason = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // If parsing fails, just store the message as a single-element array.
          reason = [reason.message];
        }
        acc.errors.push(...reason); // Flatten errors into the main array
      }
      return acc;
    },
    { values: [], errors: [] },
  );

  if (errors.length > 0) {
    const distinctErrors = Array.from(new Set(errors));
    throw new Error(JSON.stringify(distinctErrors));
  }

  return values;
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
