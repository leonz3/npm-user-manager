const inquirer = require('inquirer');
const config = require('./config');
const npmCmd = require('./npm-cmd');

function getUserList() {
    return config.readConfig()
        .then(res => {
            if (res) {
                const users = Object.keys(res);
                if (!users.length) {
                    throw Error('user list is empty');
                }
                return users;
            } else {
                throw Error('user list is empty');
            }
        });
}

function getUserInfo(userName) {
    return config.readConfig().then(config => config && config[userName]);
}

function loginByUserName(userName) {
    const name = userName.trim();
    Promise.all([
        npmCmd.whoami(),
        getUserInfo(userName)
    ]).then((res) => {
        const [current, userInfo] = res;
        if (name !== current) {
            if (!userInfo) {
                throw Error(`missing ${name} config`);
            }
            return npmCmd.login(userInfo);
        }
    }).then(() => {
        console.log(`the user has been changed to ${name}`);
    }).catch((err) => {
        console.log(err.message);
    });
}

function loginByPrompt() {
    return getUserList()
        .then((res) => {
            return inquirer.prompt({
                type: 'list',
                message: 'choose user',
                name: 'name',
                choices: res
            })
        }).then((res) => {
            return loginByUserName(res.name);
        });
}

exports.showUserList = () => {
    Promise.all([
        getUserList(),
        npmCmd.whoami()
    ]).then(res => {
        const [list, current] = res;
        list.forEach((item) => {
            if (item === current) {
                console.log(`* ${item}`);
            } else {
                console.log(`  ${item}`);
            }
        });
    }).catch(err => {
        console.log(err.message);
    });
};

exports.showCurrentUser = () => {
    npmCmd.whoami().then(res => {
        if (!res) {
            console.log('npm not log in');
        } else {
            console.log(res);
        }
    });
};

exports.changeUser = (userName) => {
    if (userName) {
        loginByUserName(userName);
    } else {
        loginByPrompt();
    }
};
