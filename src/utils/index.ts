import { GetFileInterface, FileName } from './../interfaces/apiInterface';
import fs from 'fs';

export function getFile(
  fileName: FileName,
  dimensionPresent: boolean,
  parsedFileName: FileName
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
  let create: boolean = false;
  let fileFullPath: string = '';
  let fileThumbPath: string = '';

  //file paths
  let pathThumbJpg = `./src/assets/thumb/${fileName.parsedName}.jpg`;
  let pathThumbPng = `./src/assets/thumb/${fileName.parsedName}.png`;
  let pathFullJpg = `./src/assets/full/${fileName.file}.jpg`;
  let pathFullPng = `./src/assets/full/${fileName.file}.png`;

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
  let parsedWidth = Number(width);
  let parsedHeight = Number(height);
  let parsedName = `${filename}-imageapi-width${parsedWidth.toString()}-height${parsedHeight.toString()}`;

  let fileName: FileName = {
    file: filename,
    parsedName: parsedName,
    width: parsedWidth,
    height: parsedHeight,
  };

  return fileName;
}
