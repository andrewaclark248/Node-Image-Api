import sharp from 'sharp';
import fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction, Router } from 'express';
import { GetFileInterface, FileName } from './../interfaces/apiInterface';
import { getFile, createParsedFileName } from './../utils/index'


export async function show(req: Request, res: Response, next: NextFunction) {
  let parsedFileName = createParsedFileName(req.query?.filename as string, req.query?.width as string, req.query?.height as string);
  let dimensionPresent: boolean = ((req.query?.width == null) || (req.query?.height == null) ? false : true)


  if (dimensionPresent) {
    let getFileResult: GetFileInterface = getFile(parsedFileName, dimensionPresent, parsedFileName); //check if file exist

    //check if file exists
    if (getFileResult.fileExist) {

        //if file not cached create file
        if (getFileResult.create) {
            var data = fs.readFileSync(getFileResult.fileFullPath);
            let newImage = await sharp(data)
                                    .resize({
                                        width: parsedFileName.width,
                                        height: parsedFileName.height,
                                    })
                                    .toBuffer();
                                    
            fs.writeFileSync(getFileResult.fileThumbPath, newImage, { flag: 'w' });
        }

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

