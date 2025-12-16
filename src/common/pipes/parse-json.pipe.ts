import { Injectable, PipeTransform, BadRequestException, Logger, ArgumentMetadata } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { validationExceptionFactory } from '../exceptions/validation-exception.factory';
import { ErrorMessages } from '../constants/error-messages.enum';

@Injectable()
export class ParseJsonPipe<T> implements PipeTransform<string, Promise<T | T[]>> {
  private readonly logger = new Logger(ParseJsonPipe.name);

  constructor(private readonly dto: new () => T) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<T | T[]> {
    if (!value) {
      return metadata.type === 'body' ? ({} as T) : ([] as T[]);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      this.logger.warn(`[parse-json] Error parsing JSON: ${e.message} for value: ${value}`);
      throw new BadRequestException(ErrorMessages.INVALID_REQUEST_PARAMETER);
    }

    if (Array.isArray(parsed)) {
      const instances: T[] = plainToInstance(this.dto, parsed as object[]);
      for (const [index, instance] of instances.entries()) {
        const errors: ValidationError[] = await validate(instance as object, {
          whitelist: true,
          forbidNonWhitelisted: false
        });
        if (errors.length) {
          this.logger.warn(`[parse-json] Validation failed at index ${index}: ${JSON.stringify(errors)}`);
          throw validationExceptionFactory(errors);
        }
      }
      return instances;
    } else {
      const instance: T = plainToInstance(this.dto, parsed as object);
      const errors: ValidationError[] = await validate(instance as object, {
        whitelist: true,
        forbidNonWhitelisted: false
      });
      if (errors.length) {
        this.logger.warn(`[parse-json] Validation failed: ${JSON.stringify(errors)}`);
        throw validationExceptionFactory(errors);
      }
      return instance;
    }
  }
}
