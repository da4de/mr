import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /*TODO delete*/
  getHello(): string {
    return `Hello World!`;
  }
}
