import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());
    super.catch(properException, host);
  }
}
