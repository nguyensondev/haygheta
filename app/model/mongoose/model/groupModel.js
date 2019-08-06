/*
* @Author: bxm09
* @Date:   2017-07-20 08:31:46
* @Last Modified by:   bxm09
* @Last Modified time: 2017-07-20 08:36:04
*/

let mongoose = require('mongoose');
let groupSchema = require('../schema/groupSchema');

// 将 categorySchema 这个模式发布为 Model
// category -> categorys
let groupModel = mongoose.model('group', groupSchema);

module.exports = groupModel;
