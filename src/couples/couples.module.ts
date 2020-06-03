import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CouplesService } from './couples.service';
import { CouplesController } from './couples.controller';
import { LoggerMiddleware } from 'src/logger.middleware';

@Module({
    providers: [CouplesService],
    controllers: [CouplesController],
})
export class CouplesModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes(CouplesController);
    }
}
