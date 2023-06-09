import * as path from 'path';
import { Request, Response } from 'express';
import { GetFileInterface } from './../interfaces/apiInterface';
import {
  getFile,
  createParsedFileName,
  imageProcessing,
} from './../utils/index';

export async function show(req: Request, res: Response): Promise<void> {
  const parsedFileName = createParsedFileName(
    req.query?.filename as string,
    req.query?.width as string,
    req.query?.height as string
  );

  const dimensionPresent = isNumber(
    req.query?.width as string,
    req.query?.height as string
  );

  if (dimensionPresent) {
    const getFileResult: GetFileInterface = getFile(
      parsedFileName,
      dimensionPresent
    ); //check if file exist

    //check if file exists
    if (getFileResult.fileExist) {
      //if file not cached create file
      await imageProcessing(getFileResult, parsedFileName);

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
  const isEmptyString: boolean =
    Number(width) == 0 || Number(height) == 0 ? true : false;
  if (isEmptyString) {
    return false;
  }

  const isInValidNumber: boolean =
    isNaN(Number(width)) || isNaN(Number(height)) ? true : false;
  if (isInValidNumber) {
    return false;
  }

  const isNegative: boolean =
    Number(width) < 1 || Number(height) < 1 ? true : false;
  if (isNegative) {
    return false;
  }
  return true;
}
