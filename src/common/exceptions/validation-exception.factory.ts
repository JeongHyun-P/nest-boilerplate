import { BadRequestException, Logger, ValidationError } from '@nestjs/common';
import { ErrorMessages } from '../constants/error-messages.enum';

const logger = new Logger('ValidationExceptionFactory');

function formatErrors(errors: ValidationError[]) {
  const result: any = [];

  const traverse = (error: ValidationError, parentPath = '') => {
    const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      result.push(`${propertyPath} => ${JSON.stringify(error.constraints)}`);
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child) => traverse(child, propertyPath));
    }
  };

  errors.forEach((error) => traverse(error));
  return result;
}

export function validationExceptionFactory(errors: ValidationError[]) {
  const formatted = formatErrors(errors);

  logger.warn(`Validation failed: ${formatted.join(', ')}`);

  return new BadRequestException(ErrorMessages.INVALID_REQUEST_PARAMETER);
}
