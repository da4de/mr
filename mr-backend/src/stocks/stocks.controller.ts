import { Controller, Get, Query } from "@nestjs/common";
import { ITickersQueryDTO } from "./dto/tickers.query.dto";
import { StocksService } from "./stocks.service";

@Controller('stocks')
export class StocksController {
    constructor(private stocksService: StocksService) { }

    @Get('tickers')
    async tickers(@Query() query: ITickersQueryDTO) {
        return this.stocksService.tickers(query)
    }


}