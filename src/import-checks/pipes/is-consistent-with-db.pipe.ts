import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isNumberString,
} from 'class-validator';
import { getEntityManager } from '../utilities/utils';

const entityManager = getEntityManager();

export function IsConsistentWithDB(
  sqlStatement: string,
  entityType: any,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsConsistentWithDB',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            entityManager.findOne().then(Entity => {
              if (Entity !== undefined) {
              }
            });
          }
          return true;
        },
      },
    });
  };
}
