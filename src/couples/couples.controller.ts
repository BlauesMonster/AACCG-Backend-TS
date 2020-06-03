import { Controller, Post, Req, Get, Inject, Logger } from '@nestjs/common';
import { CouplesService } from './couples.service';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CoupleInfoDecorator } from './couple-info.decorator';
import { CoupleInfo } from 'src/models/CoupleInfo';

@Controller('couples')
export class CouplesController {
    private readonly coupleService: CouplesService;

    constructor(
        coupleService: CouplesService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.coupleService = coupleService;
    }

    @Post()
    createCouplesFromFile(
        @CoupleInfoDecorator() coupleInfo: CoupleInfo,
    ): Promise<string[]> {
        if (coupleInfo.fileContent) {
            return this.coupleService.createCouplesFromFile(
                coupleInfo.fileContent,
            );
        }
        if (coupleInfo.imageUrl) {
            return this.coupleService.createCouplesFromUrl(coupleInfo.imageUrl);
        }
        return Promise.resolve([]);
    }

    @Get('testX')
    createCouplesTestX(): Promise<string[]> {
        const s =
            'https://anime.academy/img/Assets/profile/gallery/8102_Luhmbdp1C7or_flauschpng.png';
        return this.coupleService.createCouplesFromUrl(s);
    }

    @Get('testY')
    createCouplesTestY(): Promise<string[]> {
        const s =
            'https://anime.academy/img/Assets/profile/gallery/8102_zHtNvVFA72Pn_flauschpng.png';
        return this.coupleService.createCouplesFromUrl(s);
    }
}
