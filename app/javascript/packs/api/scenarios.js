import axios from 'axios';

export default {
  upload(callback) {
    axios.get('/scenarios.json').then(function(response) {
      callback(response.data)
    });
  }
}