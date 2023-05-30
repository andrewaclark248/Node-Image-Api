export interface GetFileInterface {
  fileExist: boolean;
  dimensionsPresent: boolean;
  create: boolean;
  fileFullPath: string;
  fileThumbPath: string;
}

export interface FileName {
    file: string; //basename of file
    width: number;
    height: number;
    parsedName: string; //basename of file includes width and height
}