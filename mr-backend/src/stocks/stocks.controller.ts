import { Controller, Get, Query } from "@nestjs/common";
import { StocksSearchQueryDTO } from "./dto/stocks-search.query.dto";
import { StocksService } from "./stocks.service";
import { MarketStatusQueryDTO } from "./dto/market-status.query.dto";
import { MarketStatus } from "./dto/market-status.response";
import { StocksSearchResult } from "./dto/stocks-search.response";

/**
 * Stocks controller 
 */
@Controller('stocks')
export class StocksController {
    constructor(private stocksService: StocksService) { }

    /** Search stocks by query parameters */
    @Get('search')
    async search(@Query() query: StocksSearchQueryDTO): Promise<StocksSearchResult> {
        return this.stocksService.search(query)
    }

    /** Retrieve current market status  */
    @Get('status')
    async status(@Query() query: MarketStatusQueryDTO): Promise<MarketStatus> {
        return this.stocksService.status(query)
    }

    /** Starts simulation, only for testing */
    @Get('generation')
    async generation(): Promise<void> {
        return this.stocksService.generation()
    }
}