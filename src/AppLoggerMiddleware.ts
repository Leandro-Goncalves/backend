import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const removeEmpty = (obj) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === 'object' && removeEmpty(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k]),
  );
  return obj;
};

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Route logger');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const url = req.path;
    const method = req.method;

    return next.handle().pipe(
      catchError((err) => {
        const errorMessage = err.message;
        this.logger.error(`${method} ${url} [${err.status}] - ${errorMessage}`);
        return throwError(() => err);
      }),
      tap((data) => {
        this.logger.debug(`${method} ${url} [${res.statusCode}]`);
        return typeof data === 'object' ? removeEmpty(data) : data;
      }),
    );
  }
}
