import axios from 'axios';

export default {
    upload(callback) {
        return axios.get('/scenarios.json').then((response) => {
            callback(response.data);
        });
    },
    update(id, data, callback, error) {
        const token = document.querySelector("[name='csrf-token']").getAttribute("content");
        return axios.put('/scenarios/' + id + '.json', data, {headers: {'x-csrf-token': token}}).then((response) => {
            callback(response.data);
        }).catch((response) => {
            console.log(response);
            error(response.response.data)
        })
    },
    create(data, callback, error) {
        const token = document.querySelector("[name='csrf-token']").getAttribute("content");
        return axios.post('/scenarios.json', data, {headers: {'x-csrf-token': token}}).then((response) => {
            callback(response.data);
        }).catch((response) => {
            console.log(response);
            error(response.response.data)
        })
    },
    erase(id, callback, error) {
        const token = document.querySelector("[name='csrf-token']").getAttribute("content");
        return axios.delete('/scenarios/' + id + '.json', {headers: {'x-csrf-token': token}}).then((response) => {
            callback();
        }).catch((response) => {
            error();
        })
    }
}