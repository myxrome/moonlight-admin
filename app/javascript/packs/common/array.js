Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};

Array.prototype.replace = function (index, item) {
    this.splice(index, 1, item);
};

export default {

}