let mongoose = require('mongoose');
let typeSchema = require('../schema/typeSchema');

// 将 categorySchema 这个模式发布为 Model
// category -> categorys
let typeModel = mongoose.model('type', typeSchema);

module.exports = typeModel;