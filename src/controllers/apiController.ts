import sharp from 'sharp';
import fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import { GetFileInterface } from './../interfaces/apiInterface';
import { getFile, createParsedFileName } from './../utils/index';

export async function show(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let parsedFileName = createParsedFileName(
    req.query?.filename as string,
    req.query?.width as string,
    req.query?.height as string
  );

  let dimensionPresent = isNumber(
    req.query?.width as string,
    req.query?.height as string
  );

  console.log('dimensionPresent', dimensionPresent);
  if (dimensionPresent) {
    let getFileResult: GetFileInterface = getFile(
      parsedFileName,
      dimensionPresent,
      parsedFileName
    ); //check if file exist

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

function isNumber(width: string, height: string): boolean {
  let isEmptyString: boolean =
    Number(width) == 0 || Number(height) == 0 ? true : false;
  if (isEmptyString) {
    return false;
  }

  let isInValidNumber: boolean =
    isNaN(Number(width)) || isNaN(Number(height)) ? true : false;
  if (isInValidNumber) {
    return false;
  }

  let isNegative: boolean =
    Number(width) < 1 || Number(height) < 1 ? true : false;
  if (isNegative) {
    return false;
  }
  return true;
}
