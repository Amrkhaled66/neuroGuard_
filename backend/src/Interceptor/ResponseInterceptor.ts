import { NestInterceptor } from "@nestjs/common";


export class ResponseInterceptor implements NestInterceptor {
  intercept(context: any, call$: any) {
    return call$.handle().pipe((data: any) => {
      return {
        data,
        success: true,
      };
    });
  }
}