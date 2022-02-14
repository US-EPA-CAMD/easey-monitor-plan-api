import { BadRequestException } from '@nestjs/common';
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
