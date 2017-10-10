import axios from 'axios';

export default {
  upload(callback) {
    axios.get('/scenarios.json').then(function(response) {
      callback(response.data)
    });
  },
  update(id, data, callback, error) {
    const token = document.querySelector("[name='csrf-token']").getAttribute("content");
    axios.put('/scenarios/'+ id + '.json', data, {headers: {'x-csrf-token': token}}).then(function (response) {
      callback(response.data)
    }).catch(function (response) {
      console.log(response);
      error(response.response.data)
    })
  }
}