import sharp from 'sharp';
import fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction, Router } from 'express';
import { GetFileInterface } from './../interfaces/apiInterface';

function getFile(fileName: string | null): GetFileInterface {
  let fileExist: boolean = false;
  let filePath: string = '';
  let pathJpg = `./src/assets/full/${fileName}.jpg`;
  let pathPng = `./src/assets/full/${fileName}.png`;

  try {
    if (fs.existsSync(pathJpg)) {
      fileExist = true;
      filePath = pathJpg;
    } else if (fs.existsSync(pathPng)) {
      fileExist = true;
      filePath = pathPng;
    }
  } catch (err) {
    console.error(err);
  }

  return { fileExist: fileExist, filePath: filePath };
}

function checkCache(fileName: string): GetFileInterface {
  let result: GetFileInterface = { fileExist: false, filePath: '' };
  let fileExist: boolean = false;
  let filePath: string = '';
  let pathJpg: string = `./src/assets/thumb/${fileName}.jpg`;
  let pathPng: string = `./src/assets/thumb/${fileName}.png`;

  try {
    if (fs.existsSync(pathJpg)) {
      result.fileExist = true;
      result.filePath = pathJpg;
    } else if (fs.existsSync(pathPng)) {
      fileExist = true;
      filePath = pathPng;
    }
  } catch (err) {
    console.error(err);
  }

  return result;
}

export async function show(req: Request, res: Response, next: NextFunction) {
  let file: GetFileInterface = getFile(req.query?.filename as string); //check if file exist

  //set height and width to 200 if parameter is null
  let width = Number(req.query?.width) > 1 ? Number(req.query?.width) : 200;
  let height = Number(req.query?.height) > 1 ? Number(req.query?.height) : 200;

  if (file.fileExist) {
    //caching
    let cache = checkCache(req.query?.filename as string);
    if (cache.fileExist) {
      res.sendFile(path.resolve(cache.filePath));
      return;
    }

    var data = fs.readFileSync(file.filePath);
    let newImage = await sharp(data)
      .resize({
        width: width,
        height: height,
      })
      .toBuffer();

    let fileName = path.basename(file.filePath);
    let filePath = `./src/assets/thumb/${fileName}`;
    fs.writeFileSync(filePath, newImage, { flag: 'w' });

    res.sendFile(path.resolve(filePath));
  } else {
    res.send('please provide a filename; not provided');
  }
}

//jpg
//png
