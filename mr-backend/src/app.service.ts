import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World! POLY_API_KEY="${process.env.POLY_API_KEY}"`;
  }
}
