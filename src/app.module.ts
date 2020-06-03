import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouplesModule } from './couples/couples.module';

@Module({
    imports: [CouplesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
