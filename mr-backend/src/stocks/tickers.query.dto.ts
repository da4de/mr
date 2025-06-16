import { ITickersQuery } from "@polygon.io/client-js";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, Max, Min, MinLength } from "class-validator";

export enum TickerTypeEnum {
    CS = "CS",
    ADRC = "ADRC",
    ADRP = "ADRR",
    UNIT = "UNIT",
    RIGHT = "RIGHT",
    PFD = "PFD",
    FUND = "FUND",
    SP = "SP",
    WARRENT = "WARRENT",
    INDEX = "INDEX",
    ETF = "ETF",
    ETN = "ETN",
}

export enum MarketTypeEnum {
    stocks = "stocks",
    crypto = "crypto",
    fx = "fx",
    otc = "otc",
    indices = "indices",
}

export enum OrderEnum {
    asc = 'asc',
    desc = 'desc',
}

export class ITickersQueryDTO implements ITickersQuery {
    [key: string]: string | number | boolean | undefined;
    @IsOptional()
    ticker?: string;
    @IsOptional()
    @IsEnum(TickerTypeEnum)
    type?: TickerTypeEnum = TickerTypeEnum.CS;
    @IsOptional()
    @IsEnum(MarketTypeEnum)
    market?: MarketTypeEnum = MarketTypeEnum.stocks;
    @IsOptional()
    @MinLength(1)
    search?: string;
    @IsOptional()
    active?: 'true' | 'false' = 'true';
    @IsOptional()
    sort?: string = 'ticker';
    @IsOptional()
    @IsEnum(OrderEnum)
    order?: OrderEnum = OrderEnum.asc;
    @IsOptional()
    @Min(1)
    @Max(1000)
    @Type(() => Number)
    limit?: number = 1000;
}
