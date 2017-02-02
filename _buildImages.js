const fs = require('fs');
const gm = require('gm');
const process = require('process');

// This will create a dir given a path such as './folder/subfolder'
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

// gm('src/images/test/medieval-blood-and-gore.jpg')
// .resize(240, 240)
// .write('dist/images/test/medieval-blood-and-gore-small.jpg', (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('done');
//     }
// });

const walkDir = (dir, filelist) => {
    if (dir[dir.length - 1] !== '/') {
        dir = dir.concat('/');
    }

    const files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach((file) => {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkDir(dir + file + '/', filelist);
        } else {
            filelist.push(dir + file);
        }
    });
    return filelist;
};

console.log(walkDir('src/images'));
