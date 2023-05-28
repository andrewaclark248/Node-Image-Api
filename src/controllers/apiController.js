import sharp from 'sharp'
import fs from 'fs';
import * as path from 'path';

class AuthController {

    async show(req, res, next) {
        let fileName = req.query?.filename

        if (fileName != null) {
            let file = "./../assets/full/fjord.jpg"

            let file2 = "./src/assets/full/fjord.jpg"

            var data = fs.readFileSync(file2);

            let newImage = await sharp(data)
                                    .resize({
                                        width: 150,
                                        height: 150
                                    }).toBuffer()
                                    //.toFile("./output.png"); //`${fileName}.png`
            
            const fileContent = "This is an example";
 
            let filePath = "./src/assets/thumb/output.png"
            fs.writeFileSync(filePath, newImage, { flag: 'w' }, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully Written to File.");

                }
            });
            
            //res.sendFile(path [, options] [, fn])
            res.send("send response");


        } else {
            res.send("please provide a filename; not provided");
        }

    }

}



export default new AuthController;
