import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [StocksController],
  providers: [StocksService],
})
export class AppModule {}
