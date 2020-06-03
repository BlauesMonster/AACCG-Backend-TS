import { Injectable } from '@nestjs/common';
import Jimp = require('jimp');
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { response } from 'express';
import { join } from 'path';

@Injectable()
export class CouplesService {
    cleanupCouples(): void {
        const testFolder = join(__dirname, '..', '..', 'public', 'couples');
        if (!fs.existsSync(testFolder)) {
            fs.mkdirSync(testFolder);
        }
        fs.readdir(testFolder, (err, files) => {
            files.forEach(file => {
                const fileStats = fs.statSync(`${testFolder}/${file}`);
                const birthdate = fileStats.mtime.getTime();
                const datenow = new Date().getTime();
                if (birthdate + 1000 * 60 * 5 < datenow) {
                    fs.unlinkSync(`${testFolder}/${file}`);
                }
                // console.log(x); // use those file and return it as a REST API
            });
        });
    }

    constructor() {
        console.log('Initialize Deletion');
        setInterval(this.cleanupCouples, 1000);
    }
    createCouplesFromUrl(s: string): Promise<string[]> {
        return Jimp.read(s)
            .then(image => {
                const response = this.generateCouples(image);
                return response;
            })
            .catch(err => {
                // Handle an exception.
            }) as Promise<string[]>;
    }
    createCouplesFromFile(
        fileContent: ArrayBuffer | string,
    ): Promise<string[]> {
        const fileBase64 = fileContent as string;
        return Jimp.read(
            Buffer.from(
                fileBase64.replace(/^data:image\/png;base64,/, ''),
                'base64',
            ),
        )
            .then(image => {
                const response = this.generateCouples(image);
                return response;
            })
            .catch(err => {
                // Handle an exception.
            }) as Promise<string[]>;
    }

    serverUrl = 'http://localhost:3000/';

    avatarSize = {
        Width: 150,
        Height: 150,
    };

    finalresult: string[] = [];

    createImage(
        originalImage: Jimp,
        cropPosX: number,
        cropPosY: number,
    ): string {
        const image: Jimp = originalImage.clone();
        image.crop(
            cropPosX,
            cropPosY,
            this.avatarSize.Width,
            this.avatarSize.Height,
        );
        const name = uuidv4();
        const filePath = `couples/${name}.${originalImage.getExtension()}`;
        image.write(`./public/${filePath}`);

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

    getOffsetValue(substractionValue): number {
        return (300 - substractionValue) / 2;
    }

    generateCouples(image: Jimp): string[] {
        // Do stuff with the image.
        const workImage: Jimp = image.clone();
        workImage.autocrop(false);

        let response: string[] = [];
        if (workImage.bitmap.width > workImage.bitmap.height) {
            response = this.generateHorizontalCouple(workImage);
        } else if (workImage.bitmap.height >= workImage.bitmap.width) {
            response = this.generateVerticalCouple(workImage);
        }
        return response;
    }
}
