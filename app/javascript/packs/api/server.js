import axios from 'axios';

export default {
    request(path, callback, error) {
        return axios.get('/' + path + '.json').then((response) => {
            callback(response.data);
        }).catch((response) => {
            error(response)
        });
    },
    create(path, data, callback, error) {
        const token = getCSRFToken();
        return axios.post('/' + path + '.json', data, {headers: {'x-csrf-token': token}}).then((response) => {
            callback(response.data);
        }).catch((response) => {
            console.log(response);
            error(response.response.data)
        })
    },
    update(path, id, data, callback, error) {
        const token = getCSRFToken();
        return axios.put('/' + path + '/' + id + '.json', data, {headers: {'x-csrf-token': token}}).then((response) => {
            callback(response.data);
        }).catch((response) => {
            console.log(response);
            error(response.response.data)
        })
    },
    destroy(path, id, callback, error) {
        const token = getCSRFToken();
        return axios.delete('/' + path + '/' + id + '.json', {headers: {'x-csrf-token': token}}).then((response) => {
            callback();
        }).catch((response) => {
            error(response);
        })
    }
}

function getCSRFToken() {
    return document.querySelector("[name='csrf-token']").getAttribute("content");
}
