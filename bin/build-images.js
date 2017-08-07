/*******************************************************************************
node script for building a nice responsive images from the source directory

NOTE: it can and will overwrite existing files in destinationDir
NOTE: this can fail when doing stuff over multiple images, see:
https://github.com/aheckmann/gm/issues/502
https://github.com/aheckmann/gm/issues/488
*******************************************************************************/

const fs = require('fs');
const gm = require('gm');
const process = require('process');
const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
const sourceDir = './src/images';
const destinationDir = './dist/images';
const imageSizes = {
    small: {
        width: 400,
        height: 400,
        jpgQuality: 80,
        suffix: '_small'
    }
};
const checkmarkString = '\u2713';

/*******************************************************************************
filesystem-oriented helpers
*******************************************************************************/

// creates a nested structure of directories given a path "./folder/subfolder"
const createDir = (dir) => {
    const splitPath = dir.split('/');
    splitPath.reduce((path, subPath) => {
        let currentPath = null;
        if (subPath === '.') {
            currentPath = subPath;
        } else {
            currentPath = path + '/' + subPath;
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
        }
        return currentPath;
    }, '');
};

// returns all files found in directory (subdirectories included)
// @param {string} dir - path from which to get the files
// @param {array} filelist - an optional parameter for the recursive magic
const getFilesFromDir = (dir, filelist) => {
    if (dir[dir.length - 1] !== '/') {
        dir = dir.concat('/');
    }

    const files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach((file) => {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = getFilesFromDir(dir + file + '/', filelist);
        } else {
            filelist.push(dir + file);
        }
    });
    return filelist;
};

// returns all directories found in directory (subdirectories included)
// @param {string} dir - path from which to get the directories
// @param {array} dirlist - an optional parameter for the recursive magic
const getDirsFromDir = (dir, dirlist) => {
    if (dir[dir.length - 1] !== '/') {
        dir = dir.concat('/');
    }

    const files = fs.readdirSync(dir);
    dirlist = dirlist || [];

    files.forEach((file) => {
        if (fs.statSync(dir + file).isDirectory()) {
            dirlist.push(dir + file);
            dirlist = getDirsFromDir(dir + file + '/', dirlist);
        }
    });
    return dirlist;
};

// adds suffix to filename!
const addSuffixToFilename = (file, suffix) => {
    const dotIndex = file.lastIndexOf('.');
    if (dotIndex === -1) {
        return file + suffix;
    } else {
        return file.substring(0, dotIndex) + suffix + file.substring(dotIndex);
    }
};

const copyFileToDest = (file) => {
    const finalPath = file.replace(sourceDir, destinationDir);
    fs.writeFileSync(finalPath, fs.readFileSync(file));
    console.log(checkmarkString, finalPath);
};

/*******************************************************************************
generating images
*******************************************************************************/

// returns true for files with proper extensions
const isImage = (file) => {
    for (const extension of allowedImageExtensions) {
        if (file.endsWith(extension)) {
            return true;
        }
    }
    return false;
};

// creates a graphicsmagick-converted image in destinationDir
// @param {string} imagePath - source image path
// @param {integer} width
// @param {integer} height
// @param {integer} jpgQuality - 0 to 100 percent value
// @param {string} suffix - will be added just before extension
// @param {function} callback - will be called after successful conversion
const convertImage = (imagePath, width, height, jpgQuality, suffix, callback) => {
    let finalPath = imagePath.replace(sourceDir, destinationDir);
    finalPath = addSuffixToFilename(finalPath, suffix);

    const gmImage = gm(imagePath);

    if (imagePath.endsWith('jpg') || imagePath.endsWith('jpeg')) {
        gmImage.resize(width, height).quality(jpgQuality);
    } else {
        // sample resizes image without increasing the number of colors
        // TODO: check why this doesn't work correctly (ugly images with noise)
        // gmImage.sample(width, height).bitdepth(8).dither(true).colors(32);
        gmImage.sample(width, height);
    }

    gmImage.write(finalPath, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            console.log(checkmarkString, finalPath);
            callback();
        }
    });
};

/*******************************************************************************
final do-all function
*******************************************************************************/

// recursive function
// @param {array} imagesArray - will be reduced until nothing is left
const startImagesChain = (imagesArray, finishedCallback) => {
    if (imagesArray.length === 0) {
        finishedCallback();
        return;
    }
    copyFileToDest(imagesArray[0]);
    convertImage(
        imagesArray[0],
        imageSizes.small.width,
        imageSizes.small.height,
        imageSizes.small.jpgQuality,
        imageSizes.small.suffix,
        () => {
            convertImage(
                imagesArray[0],
                imageSizes.small.width * 2,
                imageSizes.small.height * 2,
                imageSizes.small.jpgQuality,
                imageSizes.small.suffix + '@2x',
                () => {
                    imagesArray.shift();
                    startImagesChain(imagesArray, finishedCallback);
                }
            );
        }
    );
};

const recreateSourceDirsInDest = () => {
    const allDirs = getDirsFromDir(sourceDir);
    allDirs.forEach((directory) => {
        const finalPath = directory.replace(sourceDir, destinationDir);
        createDir(finalPath);
    });
    console.log(checkmarkString, 'Recreated directories structure');
};

const getImagesFromSourceDir = () => {
    const images = [];
    getFilesFromDir(sourceDir).forEach((file) => {
        if (isImage(file)) {
            images.push(file);
        }
    });
    return images;
};

const buildImagesTimeLabel = 'Finished';
const buildImages = () => {
    console.time(buildImagesTimeLabel);
    console.log('Building images…');

    // STEP 1: scan source directory for directories structure and recreate it
    // in destination directory to avoid nonexist-dir errors
    recreateSourceDirsInDest();

    // STEP 2: scan source directory for all files
    // exit with error if no images found
    const allImages = getImagesFromSourceDir();
    if (allImages.length === 0) {
        console.error('No images to convert! WTF?');
        process.exit(1);
    } else {
        console.log('Found images: ' + allImages.length);
    }

    // STEP 3: create predefined image sizes for each image found
    // we do it by creating a chain of callbacks, because graphicsmagick fails
    // when doing too many files (n * 100) at once
    startImagesChain(allImages, () => {
        console.timeEnd(buildImagesTimeLabel);
    });
};

buildImages();
