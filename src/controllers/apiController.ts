import sharp from 'sharp';
import fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction, Router } from 'express';
import { GetFileInterface, FileName } from './../interfaces/apiInterface';

function getFile(fileName: FileName, dimensionPresent: boolean, parsedFileName: FileName): GetFileInterface {
  if (!dimensionPresent) {
      return { dimensionsPresent: false, fileExist: false, create: false, fileFullPath: "", fileThumbPath: "" };
  }

  //set initial GetFileInterface paramas
  let create: boolean = false
  let fileFullPath: string = '';
  let fileThumbPath: string = '';
  let unparsedFullPath: string = "";

  //file paths
  let pathThumbJpg = `./src/assets/thumb/${fileName.parsedName}.jpg`;
  let pathThumbPng = `./src/assets/thumb/${fileName.parsedName}.png`;
  let pathFullJpg = `./src/assets/full/${fileName.file}.jpg`;
  let pathFullPng = `./src/assets/full/${fileName.file}.png`;


  try {
    //check if file exists in full path
    if (fs.existsSync(pathFullJpg) || fs.existsSync(pathFullPng)) { 
        //console.log(`full path does exist for = ${fileName.file}` )
        fileFullPath = fs.existsSync(pathFullJpg) ? `./src/assets/full/${fileName.file}.jpg` : `./src/assets/full/${fileName.file}.png`;
        let ext: string = fs.existsSync(pathFullJpg) ? `jpg` : `png`;
        let parsedName: string = `${fileName.file}-imageapi-width${parsedFileName.width.toString()}-height${parsedFileName.height.toString()}.${ext}`
        fileThumbPath = `./src/assets/thumb/${parsedName}`;

        if (fs.existsSync(pathThumbJpg) ) {
            create = false;
            //fileThumbPath = `./src/assets/thumb/${fileName.file}.jpg`
        } else if (fs.existsSync(pathThumbPng)) {
            create = false;
            //fileThumbPath = `./src/assets/thumb/${fileName.file}.png`
        } else {

            create = true;
        }

        return { dimensionsPresent: true, fileExist: true, create: create, fileFullPath: fileFullPath, fileThumbPath: fileThumbPath }

    } else {
        return { dimensionsPresent: true, fileExist: false, create: false, fileFullPath: "", fileThumbPath: ""};
    }




  } catch (err) {
    console.error(err);
  }
  return { dimensionsPresent: false, fileExist: false, create: false, fileFullPath: "", fileThumbPath: fileThumbPath }
}


export async function show(req: Request, res: Response, next: NextFunction) {
  let parsedFileName = createParsedFileName(req.query?.filename as string, req.query?.width as string, req.query?.height as string);
  let dimensionPresent: boolean = ((req.query?.width == null) || (req.query?.height == null) ? false : true)


  if (dimensionPresent) {
    let getFileResult: GetFileInterface = getFile(parsedFileName, dimensionPresent, parsedFileName); //check if file exist

    //check if file exists
    if (getFileResult.fileExist) {

        //create.true
        if (getFileResult.create) {
            //create file

            var data = fs.readFileSync(getFileResult.fileFullPath);
            let newImage = await sharp(data)
                                    .resize({
                                        width: parsedFileName.width,
                                        height: parsedFileName.height,
                                    })
                                    .toBuffer();
                                    
            fs.writeFileSync(getFileResult.fileThumbPath, newImage, { flag: 'w' });
        }


        //let filePath = (getFileResult.create) ?  parsedFileName.parseNamePath : getFileResult.fileFullPath;

        console.log("fileThumbPath", getFileResult.fileThumbPath);

        res.sendFile(path.resolve(getFileResult.fileThumbPath));


    } else {
        //file does not exist
        res.send('please provide a filename; not provided');
    }
  } else {
      //must pass demensions
      res.send('please pass file demensions');
  }


}

function createParsedFileName(filename: string, width: string, height: string): FileName {
      //set height and width to 200 if parameter is null
  let parsedWidth = Number(width) > 1 ? Number(width) : 200;
  let parsedHeight = Number(height) > 1 ? Number(height) : 200;
  let parsedName = `${filename}-imageapi-width${parsedWidth.toString()}-height${parsedHeight.toString()}`
  let parseNamePath = `./src/assets/thumb/${parsedName}`;

  let fileName: FileName = {file: filename, parsedName: parsedName, parseNamePath: parseNamePath,width: parsedWidth, height: parsedHeight}
  
  return fileName;
}

