/*******************************************************************************
node script for building a nice responsive images from the source directory

NOTE: it can and will overwrite existing files in destinationDirectory
*******************************************************************************/

const fs = require('fs');
const gm = require('gm');
const process = require('process');
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
const sourceDirectory = './src/images';
const destinationDirectory = './dist/images';
const imageSizes = {
    small: {
        width: 400,
        height: 400,
        quality: 80,
        suffix: '_small'
    },
    small_2x: {
        width: 800,
        height: 800,
        quality: 80,
        suffix: '_small_2x'
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

const suffixize = (file, string) => {
    const dotIndex = file.lastIndexOf('.');
    if (dotIndex === -1) {
        return file + string;
    } else {
        return file.substring(0, dotIndex) + string + file.substring(dotIndex);
    }
};

const convertImage = (fromDir, toDir, imagePath, properties) => {
    let finalPath = imagePath.replace(fromDir, toDir);
    finalPath = suffixize(finalPath, properties.suffix);

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
};

const buildImages = (fromDir, toDir) => {
    // STEP 1: scan source directory for directories structure and recreate it
    // in destination directory to avoid nonexist-dir errors
    const allDirs = getDirsFromDir(fromDir);
    console.log('\nFound dirs:\n');
    allDirs.forEach((directory) => {
        console.log(directory);
    });
    allDirs.forEach((directory) => {
        const finalPath = directory.replace(fromDir, toDir);
        createDir(finalPath);
    });

    // STEP 2: scan source directory for all files
    const allImages = getFilesFromDir(fromDir);
    console.log('\nFound images:\n');
    allImages.forEach((image) => {
        console.log(image);
    });

    // STEP 3: create predefined image sizes for each image found
    console.log('\nStarting working on images\n');
    allImages.forEach((imagePath) => {
        console.log(imagePath);
        convertImage(fromDir, toDir, imagePath, imageSizes.small);
        convertImage(fromDir, toDir, imagePath, imageSizes.small_2x);
    });
};

buildImages(sourceDirectory, destinationDirectory);

/*
todo:
- filter files list by image extensions array
*/
