var express = require('express');
var router = express.Router();
var Jimp = require('jimp');
const {
    v4: uuidv4
} = require('uuid');

const serverUrl = "http://localhost:3000/"

const avatarSize = {
    Width: 150,
    Height: 150
};

function createImage(originalImage, cropPosX, cropPosY) {
    let image = originalImage.clone();
    image.crop(cropPosX, cropPosY, avatarSize.Width, avatarSize.Height);
    let name = uuidv4();
    let filePath = `couples/${name}.${originalImage.getExtension()}`;
    image.write(`./public/${filePath}`);

    return `${serverUrl}${filePath}`;
}

function generateHorizontalCouple(workImage) {
    let response = [];
    workImage.resize(Jimp.AUTO, 150);

    let imageArea = new Jimp(300, 150, 0x0);
    let offsetX = getOffsetValue(workImage.bitmap.width);
    imageArea.composite(workImage, offsetX, 0);

    response.push(createImage(imageArea, 0, 0));
    response.push(createImage(imageArea, 150, 0));

    return response;
}

function generateVerticalCouple(workImage) {
    let response = [];
    workImage.resize(150, Jimp.AUTO);

    let imageArea = new Jimp(150, 300, 0x0);
    let offsetY = getOffsetValue(workImage.bitmap.height);
    imageArea.composite(workImage, 0, offsetY);

    response.push(createImage(imageArea, 0, 0));
    response.push(createImage(imageArea, 0, 150));

    return response;
}



function getOffsetValue(substractionValue) {
    return (300 - substractionValue) / 2
}

function generateCouples(image) {
    // Do stuff with the image.
    let workImage = image.clone();
    workImage.autocrop(false);

    let response = [];
    if (workImage.bitmap.width > workImage.bitmap.height) {
        response = generateHorizontalCouple(workImage);

    } else if (workImage.bitmap.height >= workImage.bitmap.width) {
        response = generateVerticalCouple(workImage);
    }
    return response;
}


/* GET home page. */
router.post('/', (req, res, next) => {
    let uploadedFile = req.body
    let fileContent = uploadedFile.content
    Jimp.read(Buffer.from(fileContent.replace(/^data:image\/png;base64,/, ""), 'base64'))
        .then(image => {
            let response = generateCouples(image);
            res.send(response)
        })
        .catch(err => {
            // Handle an exception.
        });
});

router.get('/testX', (req, res, next) => {

    Jimp.read('https://anime.academy/img/Assets/profile/gallery/8102_Luhmbdp1C7or_flauschpng.png')
        .then(image => {
            let response = generateCouples(image);
            res.send(response)
        })
        .catch(err => {
            // Handle an exception.
        });
});

router.get('/testY', (req, res, next) => {

    Jimp.read('https://anime.academy/img/Assets/profile/gallery/8102_zHtNvVFA72Pn_flauschpng.png')
        .then(image => {
            let response = generateCouples(image);
            res.send(response)
        })
        .catch(err => {
            // Handle an exception.
        });
});

const fs = require('fs');

function cleanupCouples() {
    const testFolder = './public/couples';
    if (!fs.existsSync(testFolder)) {
        fs.mkdirSync(testFolder);
    }
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            let fileStats = fs.statSync(`${testFolder}/${file}`)
            let birthdate = fileStats.mtime.getTime();
            let datenow = new Date().getTime();
            if (birthdate + (1000 * 60 * 5) < datenow) {
                fs.unlinkSync(`${testFolder}/${file}`)
            }
            // console.log(x); // use those file and return it as a REST API
        });
    })
}






setInterval(cleanupCouples, 1000);

module.exports = router;