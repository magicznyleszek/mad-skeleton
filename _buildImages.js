const fs = require('fs');
const gm = require('gm');

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
    }, '')
};

createDir('./dist/images/test');

gm('src/images/test/medieval-blood-and-gore.jpg')
.resize(240, 240)
.write('dist/images/test/medieval-blood-and-gore-small.jpg', (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('done');
    }
});
