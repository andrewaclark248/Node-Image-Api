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


export async function show(req, res, next) {
    let file = getFile(req.query?.filename) //check if file exist
    
    console.log("file", file)
    if (file.fileExist) {
        var data = fs.readFileSync(file.filePath);

        let newImage = await sharp(data)
                                .resize({
                                    width: 150,
                                    height: 150
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



