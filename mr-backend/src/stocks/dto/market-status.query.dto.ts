import { IsNotEmpty } from "class-validator";
import { ExchangeEnum } from "./stocks-search.query.dto";

/**
 * Query parameters for retrieving market status
 */
export class MarketStatusQueryDTO {
    @IsNotEmpty()
    exchange: ExchangeEnum;
}