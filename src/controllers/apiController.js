import sharp from 'sharp'
import fs from 'fs';
import * as path from 'path';


function getFile(fileName) {
    let fileExist = false;
    let filePath = null
    let pathJpg = `./src/assets/full/${fileName}.jpg`
    let pathPng = `./src/assets/full/${fileName}.png`

    try {
        if (fs.existsSync(pathJpg)) {
            fileExist = true;
            filePath = pathJpg;
        }else if (fs.existsSync(pathPng)) {
            fileExist = true;
            filePath = pathPng;
        }

    } catch(err) {
        console.error(err)
    }

    return {fileExist: fileExist, filePath: filePath}
} 

function checkCache(fileName) {
    let fileExist = false;
    let filePath = null
    let pathJpg = `./src/assets/thumb/${fileName}.jpg`
    let pathPng = `./src/assets/thumb/${fileName}.png`

    try {
        if (fs.existsSync(pathJpg)) {
            fileExist = true;
            filePath = pathJpg;
        }else if (fs.existsSync(pathPng)) {
            fileExist = true;
            filePath = pathPng;
        }

    } catch(err) {
        console.error(err)
    }

    return {fileExist: fileExist, filePath: filePath}
}


export async function show(req, res, next) {
    let file = getFile(req.query?.filename) //check if file exist

    //set height and width to 200 if parameter is null
    let width = Number(req.query?.width) > 1 ? Number(req.query?.width) : 200
    let height = Number(req.query?.height) > 1 ? Number(req.query?.height) : 200

    if (file.fileExist) {
        //caching
        let cache = checkCache(req.query?.filename)
        if (cache.fileExist) {
            res.sendFile(path.resolve(cache.filePath))
            return
        }

        var data = fs.readFileSync(file.filePath);
        let newImage = await sharp(data)
                                .resize({
                                    width: width,
                                    height: height
                                }).toBuffer()

        let fileName = path.basename(file.filePath)
        let filePath = `./src/assets/thumb/${fileName}`
        fs.writeFileSync(filePath, newImage, { flag: 'w' }, (err) => {

        });
        
        res.sendFile(path.resolve(filePath))
    } else {
        res.send("please provide a filename; not provided");
    }

}




//jpg
//png



