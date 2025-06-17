import { IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export enum ExchangeEnum{
    US = 'US'
}

export class ITickersQueryDTO {
    @IsNotEmpty()
    q: string;
    @IsOptional()
    @IsEnum(ExchangeEnum)
    exchange?: ExchangeEnum = ExchangeEnum.US;
}
