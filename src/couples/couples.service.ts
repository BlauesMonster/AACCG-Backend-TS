import { Injectable } from '@nestjs/common';
import Jimp = require('jimp');
import { v4 as uuidv4 } from 'uuid';
import { Avatar } from 'src/models/Avatar';
import { CoupleForm } from './CoupleForm';

@Injectable()
export class CouplesService {
    private serverUrl = 'http://localhost:3000/';
    private avatarModel: Avatar = { Width: 150, Height: 150 };

    async createCouplesFromUrl(imageUrl: string): Promise<string[]> {
        const image: Jimp = await Jimp.read(imageUrl);
        const response = this.generateCouples(image);
        return response;
    }

    async createCouplesFromFile(fileContent: string): Promise<string[]> {
        let fileBase64 = fileContent;
        fileBase64 = fileBase64.replace(/^data:image\/png;base64,/, '');
        fileBase64 = fileBase64.replace(/^data:image\/jpg;base64,/, '');
        fileBase64 = fileBase64.replace(/^data:image\/jpeg;base64,/, '');
        fileBase64 = fileBase64.replace(/^data:image\/gif;base64,/, '');

        const image: Jimp = await Jimp.read(Buffer.from(fileBase64, 'base64'));

        return this.generateCouples(image);
    }

    getOffsetValue(substractionValue: number): number {
        return (300 - substractionValue) / 2;
    }

    createImage(
        originalImage: Jimp,
        cropPosX: number,
        cropPosY: number,
    ): string {
        const image: Jimp = originalImage.clone();
        image.crop(
            cropPosX,
            cropPosY,
            this.avatarModel.Width,
            this.avatarModel.Height,
        );

        const name = uuidv4();
        const filePath = `couples/${name}.${originalImage.getExtension()}`;
        image.write(`./public/${filePath}`);
        image.write(`./private/${filePath}`);

        return `${this.serverUrl}${filePath}`;
    }

    generateHorizontalCouple(workImage: Jimp): string[] {
        const response: string[] = [];
        workImage.resize(Jimp.AUTO, 150);

        const imageArea: Jimp = new Jimp(300, 150, 0x0);
        const offsetX: number = this.getOffsetValue(workImage.bitmap.width);
        imageArea.composite(workImage, offsetX, 0);

        response.push(this.createImage(imageArea, 0, 0));
        response.push(this.createImage(imageArea, 150, 0));

        return response;
    }

    generateVerticalCouple(workImage: Jimp): string[] {
        const response: string[] = [];
        workImage.resize(150, Jimp.AUTO);

        const imageArea: Jimp = new Jimp(150, 300, 0x0);
        const offsetY: number = this.getOffsetValue(workImage.bitmap.height);
        imageArea.composite(workImage, 0, offsetY);

        response.push(this.createImage(imageArea, 0, 0));
        response.push(this.createImage(imageArea, 0, 150));

        return response;
    }

    generateCouples(originalImage: Jimp): string[] {
        const workImage = originalImage.clone();
        workImage.autocrop(false);

        const workImageWidth: number = workImage.bitmap.width;
        const workImageHeight: number = workImage.bitmap.height;

        const coupleForm: CoupleForm = this.getCoupleForm(
            workImageWidth,
            workImageHeight,
        );

        switch (coupleForm) {
            case CoupleForm.M1X2:
                return this.generateHorizontalCouple(workImage);
            case CoupleForm.M2X1:
                return this.generateVerticalCouple(workImage);
        }
    }

    getCoupleForm(workImageWidth: number, workImageHeight: number): CoupleForm {
        if (workImageWidth > workImageHeight) {
            return CoupleForm.M1X2;
        } else if (workImageHeight >= workImageWidth) {
            return CoupleForm.M2X1;
        }
        throw new Error('Error');
    }
}
