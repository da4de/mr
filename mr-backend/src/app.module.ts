import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';
import { HttpModule } from '@nestjs/axios';
import { WSocketGateway } from './websocket/websocket.gateway';
import { FinnhubService } from './stocks/finnhub.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [StocksController],
  providers: [StocksService, WSocketGateway, FinnhubService],
})
export class AppModule {}
