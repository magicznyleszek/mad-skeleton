/*******************************************************************************
node script for building a nice responsive images from the source directory

NOTE: it can and will overwrite existing files in destinationDir
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

/*******************************************************************************
helper functions
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

/*******************************************************************************
generating images
*******************************************************************************/

// adds suffix to file!
const addSuffixToFile = (file, suffix) => {
    const dotIndex = file.lastIndexOf('.');
    if (dotIndex === -1) {
        return file + suffix;
    } else {
        return file.substring(0, dotIndex) + suffix + file.substring(dotIndex);
    }
};

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
const convertImage = (imagePath, width, height, jpgQuality, suffix) => {
    let finalPath = imagePath.replace(sourceDir, destinationDir);
    finalPath = addSuffixToFile(finalPath, suffix);

    const gmImage = gm(imagePath);

    if (imagePath.endsWith('jpg') || imagePath.endsWith('jpeg')) {
        gmImage.resize(width, height).quality(jpgQuality);
    } else {
        // sample resizes image without increasing the number of colors
        gmImage.sample(width, height).bitdepth(8).dither(true).colors(32);
    }

    gmImage.write(finalPath, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            console.log('Done:', finalPath);
        }
    });
};

const copyFile = (file) => {
    const finalPath = file.replace(sourceDir, destinationDir);
    fs.writeFileSync(finalPath, fs.readFileSync(file));
    console.log('Done:', finalPath);
};

/*******************************************************************************
final do-all function
*******************************************************************************/

const buildImages = () => {
    // STEP 1: scan source directory for directories structure and recreate it
    // in destination directory to avoid nonexist-dir errors
    const allDirs = getDirsFromDir(sourceDir);
    allDirs.forEach((directory) => {
        const finalPath = directory.replace(sourceDir, destinationDir);
        createDir(finalPath);
    });
    console.log('Recreated directories structure');

    // STEP 2: scan source directory for all files
    const allImages = [];
    getFilesFromDir(sourceDir).forEach((file) => {
        if (isImage(file)) {
            allImages.push(file);
        }
    });
    console.log('Found images: ' + allImages.length);

    // exit with error if no images found
    if (allImages.length === 0) {
        console.error('No images to convert! WTF?');
        process.exit(1);
    }

    // STEP 3: create predefined image sizes for each image found
    console.log('Building images…');
    allImages.forEach((imagePath) => {
        convertImage(
            imagePath,
            imageSizes.small.width,
            imageSizes.small.height,
            imageSizes.small.jpgQuality,
            imageSizes.small.suffix
        );
        convertImage(
            imagePath,
            imageSizes.small.width * 2,
            imageSizes.small.height * 2,
            imageSizes.small.jpgQuality,
            imageSizes.small.suffix + '@2x'
        );
        copyFile(imagePath);
    });
};

buildImages();
