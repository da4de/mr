import { ITickersQuery } from "@polygon.io/client-js";
import { IsOptional, Max, Min } from "class-validator";

export class ITickersQueryDTO implements ITickersQuery{
    [key: string]: string | number | boolean | undefined;
    @IsOptional()
    ticker?: string;
    @IsOptional()
    type?: ("CS" | "ADRC" | "ADRP" | "ADRR" | "UNIT" | "RIGHT" | "PFD" | "FUND" | "SP" | "WARRENT" | "INDEX" | "ETF" | "ETN") = 'CS';
    @IsOptional()
    market?: ("stocks" | "crypto" | "fx" | "otc" | "indices") = 'stocks';
    @IsOptional()
    search?: string;
    @IsOptional()
    active?: "true" | "false" = 'true';
    @IsOptional()
    sort?: string = 'ticker';
    @IsOptional()
    order?: ("asc" | "desc") = 'asc';
    @IsOptional()
    @Min(1)
    @Max(1000)
    limit?: number = 1000;
}
