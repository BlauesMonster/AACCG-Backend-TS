import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class CleanupService implements OnApplicationBootstrap {
    onApplicationBootstrap(): void {
        console.log('Initialize Deletion');
        setInterval(this.cleanupCouples, 1000);
    }

    cleanupCouples(): void {
        const testFolder = join(__dirname, '..', '..', 'public', 'couples');
        if (!fs.existsSync(testFolder)) {
            fs.mkdirSync(testFolder);
        }
        fs.readdir(testFolder, (err, files) => {
            files.forEach(file => {
                const fileStats = fs.statSync(`${testFolder}/${file}`);
                const birthDate = fileStats.mtime.getTime();
                const dateNow = new Date().getTime();
                if (birthDate + 1000 * 60 * 5 < dateNow) {
                    fs.unlinkSync(`${testFolder}/${file}`);
                }
            });
        });
    }
}
