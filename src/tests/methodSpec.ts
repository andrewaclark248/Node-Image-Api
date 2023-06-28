import { imageProcessing } from './../utils/index';
import { GetFileInterface, FileName } from './../interfaces/apiInterface';
import fs from 'fs';


fdescribe('image processing tests', () => {

    const parsedFileName: FileName = {
        file: "fjord.jpg",
        parsedName: `fjord-imageapi-width500-height500-${Date.now()}`,
        width: 500,
        height: 500
    };

    const createNewImage: GetFileInterface = {
        fileExist: true,
        dimensionsPresent: true,
        create: true,
        fileFullPath: "./src/tests/assets/full/fjord.jpg",
        fileThumbPath: `./src/tests/assets/thumb/${parsedFileName.parsedName}.jpg`
    }

    afterEach(function() { 
        let fileExist = fs.existsSync(createNewImage.fileThumbPath)
        if (fileExist) {
            fs.unlinkSync(createNewImage.fileThumbPath)
        }
    });

    it('success', async () => {
        await imageProcessing(createNewImage, parsedFileName)

        let result = fs.existsSync(createNewImage.fileThumbPath)
        expect(result).toBe(true);
    });

    it('expect not to create file and use cache', async () => {
        createNewImage.create = false;
        await imageProcessing(createNewImage, parsedFileName)

        let result = fs.existsSync(createNewImage.fileThumbPath)
        expect(result).toBe(false);
    });
});
  


