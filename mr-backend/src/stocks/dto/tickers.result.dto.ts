import { Expose } from "class-transformer";

export class ITickers {
    count: number;
    result: {
        type: string;
        symbol: string;
        displaySymbol: string;
        description: string
    }[]
}