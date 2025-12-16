import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ErrorMessages } from '../constants/error-messages.enum';

export class ParseIdsPipe implements PipeTransform {
  transform(value: string) {
    const ids = value
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      throw new BadRequestException(ErrorMessages.INVALID_REQUEST_PARAMETER);
    }

    return ids;
  }
}
