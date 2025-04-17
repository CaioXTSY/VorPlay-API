import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryController } from './search-history.controller';
import { SearchHistoryInterceptor } from './search-history.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, JwtModule.register({}), ConfigModule],
  controllers: [SearchHistoryController],
  providers: [
    SearchHistoryService,
    { provide: APP_INTERCEPTOR, useClass: SearchHistoryInterceptor },
  ],
})
export class SearchHistoryModule {}