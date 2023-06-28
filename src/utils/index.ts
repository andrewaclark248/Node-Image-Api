import { GetFileInterface, FileName } from './../interfaces/apiInterface';
import fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export function getFile(
  fileName: FileName,
  dimensionPresent: boolean
): GetFileInterface {
  if (!dimensionPresent) {
    return {
      dimensionsPresent: false,
      fileExist: false,
      create: false,
      fileFullPath: '',
      fileThumbPath: '',
    };
  }

  //set initial GetFileInterface paramas
  let create = false;
  let fileFullPath = '';
  let fileThumbPath = '';

  //file paths
  const pathThumbJpg = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'thumb',
    `${fileName.parsedName}.jpg`
  );
  const pathThumbPng = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'thumb',
    `${fileName.parsedName}.png`
  );
  const pathFullJpg = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'full',
    `${fileName.file}.jpg`
  );
  const pathFullPng = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'full',
    `${fileName.file}.png`
  );

  try {
    //check if file exists in full path
    if (fs.existsSync(pathFullJpg) || fs.existsSync(pathFullPng)) {
      fileFullPath = fs.existsSync(pathFullJpg) ? pathFullJpg : pathFullPng;
      fileThumbPath = fs.existsSync(pathFullJpg) ? pathThumbJpg : pathThumbPng;

      if (fs.existsSync(pathThumbJpg)) {
        create = false;
      } else if (fs.existsSync(pathThumbPng)) {
        create = false;
      } else {
        create = true;
      }

      return {
        dimensionsPresent: true,
        fileExist: true,
        create: create,
        fileFullPath: fileFullPath,
        fileThumbPath: fileThumbPath,
      };
    } else {
      return {
        dimensionsPresent: true,
        fileExist: false,
        create: false,
        fileFullPath: '',
        fileThumbPath: '',
      };
    }
  } catch (err) {
    console.error(err);
  }
  return {
    dimensionsPresent: false,
    fileExist: false,
    create: false,
    fileFullPath: '',
    fileThumbPath: '',
  };
}

export function createParsedFileName(
  filename: string,
  width: string,
  height: string
): FileName {
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);
  const parsedName = `${filename}-imageapi-width${parsedWidth.toString()}-height${parsedHeight.toString()}`;

  const fileName: FileName = {
    file: filename,
    parsedName: parsedName,
    width: parsedWidth,
    height: parsedHeight,
  };

  return fileName;
}

export async function imageProcessing(
  fileResult: GetFileInterface,
  parsedName: FileName
) {
  //if file not cached create file
  if (fileResult.create) {
    const data = fs.readFileSync(fileResult.fileFullPath);
    const newImage = await sharp(data)
      .resize({
        width: parsedName.width,
        height: parsedName.height,
      })
      .toBuffer();

    fs.writeFileSync(fileResult.fileThumbPath, newImage, { flag: 'w' });
  }
}
