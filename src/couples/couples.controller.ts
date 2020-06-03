import { Controller, Post, Req, Get } from '@nestjs/common';
import { CouplesService } from './couples.service';
import { Request } from 'express';

@Controller('couples')
export class CouplesController {
    private readonly coupleService: CouplesService;

    constructor(coupleService: CouplesService) {
        this.coupleService = coupleService;
    }

    @Post()
    createCouples(@Req() request: Request): Promise<string[]> {
        const uploadedFile: any = request.body;
        const fileContent: ArrayBuffer = uploadedFile.content;
        return this.coupleService.createCouplesFromFile(fileContent);
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
