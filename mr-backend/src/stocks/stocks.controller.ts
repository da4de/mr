import { Controller, Get, Query } from "@nestjs/common";
import { ITickersQueryDTO } from "./dto/tickers.query.dto";
import { StocksService } from "./stocks.service";
import { IMarketStatusQueryDTO } from "./dto/market.status.query.dto";

@Controller('stocks')
export class StocksController {
    constructor(private stocksService: StocksService) { }

    @Get('search')
    async search(@Query() query: ITickersQueryDTO) {
        return this.stocksService.search(query)
    }

    @Get('status')
    async status(@Query() query: IMarketStatusQueryDTO) {
        return this.stocksService.status(query)
    }

    @Get('generation')
    async generation() {
        return this.stocksService.generation()
    }
}