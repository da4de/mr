import { Injectable } from "@nestjs/common";
import { ITickers, ITickersQuery, restClient } from "@polygon.io/client-js";

@Injectable()
export class StocksService {
    polygonRestClient = restClient(process.env.POLYGON_API_KEY, process.env.POLYGON_ADDRESS, {pagination: true, trace: true})

    async tickers(query: ITickersQuery): Promise<ITickers> {
        return this.polygonRestClient.reference.tickers(query);
    }
}