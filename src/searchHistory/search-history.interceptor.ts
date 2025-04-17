import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { SearchHistoryService } from './search-history.service';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class SearchHistoryInterceptor implements NestInterceptor {
    constructor(
      private readonly history: SearchHistoryService,
      private readonly jwt: JwtService,
      private readonly config: ConfigService,
    ) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const url: string = req.originalUrl ?? '';
  
      const isSearch =
        url.startsWith('/api/v1/tracks/search') ||
        url.startsWith('/api/v1/artists/search');
  
      if (isSearch) {
        let userId: number | undefined;
  
        if (req.user?.userId) {
          userId = req.user.userId;
        } else {
          const auth = (req.headers.authorization as string) ?? '';
          if (auth.startsWith('Bearer ')) {
            try {
              const payload: any = this.jwt.verify(auth.slice(7), {
                secret: this.config.get('JWT_SECRET') || 'changeme',
              });
              userId = payload.sub;
            } catch {
            }
          }
        }
  
        if (userId) {
          const q = req.query?.query as string;
          this.history.record(userId, q).catch(() => void 0);
        }
      }
      return next.handle();
    }
  }