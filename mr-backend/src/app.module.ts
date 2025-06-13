import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StocksController } from './stocks/stocks.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, StocksController],
  providers: [AppService],
})
export class AppModule {}
