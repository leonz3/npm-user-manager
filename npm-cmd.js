const childProcess = require('child_process');
const { isWin32 } = require('./env');

const npmCmdFile = isWin32 ? 'npm.cmd' : 'npm';

exports.whoami = () => {
    return new Promise((resolve) => {
        const cp = childProcess.spawn(npmCmdFile, ['whoami'], {
            stdio: ['pipe', 'pipe', 'inherit']
        });
        cp.stdout.on('data', (res) => {
            const data = res.toString().trim();
            resolve(data);
        });
    });
};

exports.login = (userInfo) => {
    return new Promise((resolve, reject) => {
        if (!userInfo.username) {
            return reject('missing username');
        }
        if (!userInfo.password) {
            return reject(`${userInfo.username} missing password`);
        }
        if (!userInfo.email) {
            return reject(`${userInfo.email} missing email`);
        }
        const cp = childProcess.spawn(npmCmdFile, ['login'], {
            stdio: ['pipe', 'pipe', 'inherit']
        });
        cp.stdout.on('data', (res) => {
            const data = res.toString().trim();
            if (/username/i.test(data)) {
                cp.stdin.write(`${userInfo.username}\n`);
            }
            else if (/password/i.test(data)) {
                cp.stdin.write(`${userInfo.password}\n`);
            }
            else if (/email/i.test(data)) {
                cp.stdin.write(`${userInfo.email}\n`);
            }
            else if (/logged in/i.test(data)) {
                cp.stdin.end();
                resolve();
            }
        });
    });
};
