import { Injectable } from "@nestjs/common";
import { ITickers } from "./dto/tickers.result.dto";
import { ITickersQueryDTO } from "./dto/tickers.query.dto";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom, Observable, toArray } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class StocksService {
    constructor(private readonly httpService: HttpService) { }

    async tickers(query: ITickersQueryDTO): Promise<ITickers> {
        const url = `${process.env.FINNHUB_ADDRESS}/api/v1/search`;
        console.log('StocksService:tickers url', url, query, process.env.FINNHUB_API_KEY)
        const { data } = await firstValueFrom(
            this.httpService.get<ITickers>(url,
                {
                    params: query,
                    headers: { "X-Finnhub-Token": process.env.FINNHUB_API_KEY }
                }).pipe(
                    catchError((error: AxiosError) => {
                        console.log(error.response?.data);
                        throw 'An error happened!';
                    })
                )
        )
        //const response = await fetch(`${process.env.FINNHUB_ADDRESS}` "https://finnhub.io/api/v1/search?q=apple&exchange=US&token=" + )
        //console.log('data', data);
        //const jsondata = await response.json();
        //console.log('jsondata', jsondata)
        return data
    }

    async tickers_finnhub() {
        const socket = new WebSocket('wss://ws.finnhub.io?token=' + process.env.FINNHUB_API_KEY);

        // Connection opened -> Subscribe
        socket.addEventListener('open', function (event) {
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'AAPL' }))
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
        });

        // Unsubscribe
        //var unsubscribe = function (symbol) {
        //    socket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }))/
        //}
    }
}