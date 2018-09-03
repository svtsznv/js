VK.init({
    apiId: 6676703
});

export function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

export function callAPI(method, params) {
    params.v = params.v || '5.78';

    return new Promise((resolve, reject) => {
        VK.api(method, params, response => {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                resolve(response.response.items);
            }
        });
    });
}