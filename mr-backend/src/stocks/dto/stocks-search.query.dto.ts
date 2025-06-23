import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

/** Supported list of exchange codes */
export enum ExchangeEnum{
    US = 'US'
}

/** Parameters for stock search */
export class StocksSearchQueryDTO {
    /** Search string */
    @IsNotEmpty()
    q: string;
    @IsOptional()
    @IsEnum(ExchangeEnum)
    exchange?: ExchangeEnum = ExchangeEnum.US;
}
