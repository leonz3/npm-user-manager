const path = require('path');
const ini = require('ini');
const file = require('./file');
const { isWin32 } = require('./env');

const NPMUMRC = path.join(
    isWin32 ? process.env.USERPROFILE : process.env.HOME,
    '.npmumrc'
);

let configCached;

exports.readConfig = () => {
    return configCached ||
        (configCached = file.readFile(NPMUMRC).then((res) => {
            const ret = ini.parse(res);
            return ret;
        })).catch(() => null);
};

exports.writeConfig = () => {

};
