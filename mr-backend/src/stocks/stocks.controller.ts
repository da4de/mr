import { Controller, Get, Query } from "@nestjs/common";
import { ITickers, restClient } from "@polygon.io/client-js";
import { ITickersQueryDTO } from "./tickers.query.dto";

@Controller('stocks')
export class StocksController {
    @Get('tickers')
    async list(
        @Query() query: ITickersQueryDTO
    ): Promise<ITickers> {
        console.log('query', query)
        const rest = restClient(process.env.POLY_API_KEY);
        return rest.reference.tickers(query);
    }
}