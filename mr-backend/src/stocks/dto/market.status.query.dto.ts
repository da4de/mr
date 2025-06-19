import { IsNotEmpty } from "class-validator";
import { ExchangeEnum } from "./tickers.query.dto";

export class IMarketStatusQueryDTO {
    @IsNotEmpty()
    exchange: ExchangeEnum;
}