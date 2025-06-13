import { Controller, Get } from "@nestjs/common";
import { restClient } from "@polygon.io/client-js";

@Controller('stocks')
export class StocksController {
    @Get('list')
    async list() {
        const rest = restClient(process.env.POLY_API_KEY);
        return rest.reference.tickers({
            market: "indices",
            active: "true",
            order: "asc",
            limit: 20,
            sort: "ticker"
        });
    }
}