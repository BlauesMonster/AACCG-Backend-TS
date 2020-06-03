import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouplesModule } from './couples/couples.module';
import { CleanupService } from './cleanup/cleanup.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
    imports: [
        CouplesModule,
        WinstonModule.forRoot({
            levels: winston.config.npm.levels,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.prettyPrint(),
                winston.format.splat(),
                winston.format.colorize(),
            ),
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                // new winston.transports.Console(),
                new winston.transports.File({
                    filename: 'error.log',
                    level: 'error',
                }),
                new winston.transports.File({ filename: 'combined.log' }),
            ],
        }),
    ],
    controllers: [AppController],
    providers: [AppService, CleanupService],
})
export class AppModule {}
