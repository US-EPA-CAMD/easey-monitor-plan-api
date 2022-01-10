import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';
import { validate } from 'class-validator';

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

export const validateObject = async object => {
  const errors = await validate(object);
  // If validation passes...
  if (!errors || errors.length <= 0) {
    // continue to update logic in the current module's service
    return;
  }

  // If validation fails...
  else {
    // Log the errors
    const errMsg =
      'Validation failed: you must include values for both End Date and End Hour fields. Otherwise, both fields must be empty in the payload.';
    Logger.error(BadRequestException, errMsg, true, {
      id: object,
    });
    throw new BadRequestException(errMsg);
  }
};
