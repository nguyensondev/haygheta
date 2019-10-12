let mongoose = require('mongoose');
let homeSchema = require('../schema/homeSchema');

// 将 categorySchema 这个模式发布为 Model
// category -> categorys
let homeModel = mongoose.model('home', homeSchema);

module.exports = homeModel;