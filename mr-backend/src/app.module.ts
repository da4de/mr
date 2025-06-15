import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, StocksController],
  providers: [AppService, StocksService],
})
export class AppModule {}
