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
        quality: 80,
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

const addSuffixToFile = (file, string) => {
    const dotIndex = file.lastIndexOf('.');
    if (dotIndex === -1) {
        return file + string;
    } else {
        return file.substring(0, dotIndex) + string + file.substring(dotIndex);
    }
};

const isImage = (file) => {
    for (const extension of allowedImageExtensions) {
        if (file.endsWith(extension)) {
            return true;
        }
    }
    return false;
};

const convertImage = (imagePath, properties, doRetina) => {
    let finalPath = imagePath.replace(sourceDir, destinationDir);
    finalPath = addSuffixToFile(finalPath, properties.suffix);

    gm(imagePath)
    .resize(properties.width, properties.height)
    .quality(properties.quality)
    .write(finalPath, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            console.log('Done:', finalPath);
        }
    });

    if (doRetina) {
        const retinaProperties = {
            width: properties.width * 2,
            height: properties.height * 2,
            quality: properties.quality,
            suffix: properties.suffix + '@2x'
        };
        convertImage(imagePath, retinaProperties, false);
    }
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
        convertImage(imagePath, imageSizes.small, true);
        copyFile(imagePath);
    });
};

buildImages();
