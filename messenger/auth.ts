import * as  db from '../common/databases/connection';

const request = require('request');

const options = {
    url: 'http://api.orchidea.space/api/whoiam',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};


export async function checkToken(token) {

    options.headers['Authorization'] = 'Bearer ' + token;

    return new Promise(((resolve, reject) => {
        request(options, function (err, res, body) {
            if (err) {
                reject(err);
            }

            try {
                let parseObject = JSON.parse(body);
                if (parseObject.hasOwnProperty('user')) {
                    let user = parseObject['user'];
                    if (user.hasOwnProperty('id') && user.hasOwnProperty('username')) {
                        resolve(user);
                    }
                }
                resolve(false)
            } catch (ex) {
                reject(ex);
            }
        });
    }));
}