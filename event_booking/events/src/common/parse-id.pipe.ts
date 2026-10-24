import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// Order and customer ids are short alphanumeric strings such as "ord_d64udwlwt39".
const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

@Injectable()
export class ParseIdPipe implements PipeTransform<string, string> {
  transform(value: string) {
    if (typeof value !== 'string' || !ID_PATTERN.test(value)) {
      throw new BadRequestException('Invalid identifier');
    }
    return value;
  }
}
