/*******************************************************************************
node script for building a nice responsive images from the source directory
*******************************************************************************/

const fs = require('fs');
const gm = require('gm');
const process = require('process');

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
const walkDirFiles = (dir, filelist) => {
    if (dir[dir.length - 1] !== '/') {
        dir = dir.concat('/');
    }

    const files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach((file) => {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkDirFiles(dir + file + '/', filelist);
        } else {
            filelist.push(dir + file);
        }
    });
    return filelist;
};

// returns all files found in directory (subdirectories included)
const walkDir = (dir, filelist) => {
    if (dir[dir.length - 1] !== '/') {
        dir = dir.concat('/');
    }

    const files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach((file) => {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist.push(dir + file);
            filelist = walkDir(dir + file + '/', filelist);
        }
    });
    return filelist;
};

/*******************************************************************************
generating images
*******************************************************************************/

const allDirs = walkDir('./src/images');
console.log('All found dirs:');
allDirs.forEach((directory) => {
    console.log(directory);
});

const allImages = walkDirFiles('./src/images');
console.log('All found images:');
allImages.forEach((image) => {
    console.log(image);
});

allDirs.forEach((directory) => {
    const finalPath = directory.replace('src/', 'dist/');
    createDir(finalPath);
});

allImages.forEach((image) => {
    console.log(image);
    const finalPath = image.replace('src/', 'dist/');
    gm(image).resize(240, 240).write(finalPath, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('done:', image);
        }
    });
});
