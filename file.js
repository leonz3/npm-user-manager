const fs = require('fs');

exports.readFile = filePath => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};
