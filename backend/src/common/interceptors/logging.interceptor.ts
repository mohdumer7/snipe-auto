import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    // Extract correlation id from headers or generate one if missing
    let correlationId = request.headers['x-correlation-id'];
    if (!correlationId) {
      correlationId = uuidv4();
      request.headers['x-correlation-id'] = correlationId;
    }
    const method = request.method;
    const url = request.url;
    this.logger.log(`[${correlationId}] Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`[${correlationId}] ${method} ${url} responded in ${delay}ms`);
      }),
    );
  }
}
