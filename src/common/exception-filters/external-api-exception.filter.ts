import { HttpException, HttpStatus } from '@nestjs/common';

export class ExternalApiFilterException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        message,
        isExternal: true
      },
      status
    );
  }
}
