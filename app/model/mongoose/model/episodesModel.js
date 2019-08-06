let mongoose = require('mongoose');
let episodesSchema = require('../schema/episodesSchema');

// 将 episodesSchema 这个模式发布为 Model
// episodes -> movie
let episodesModel = mongoose.model('episodes', episodesSchema);

module.exports = episodesModel;
