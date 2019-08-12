const mongoose = require('mongoose');

let ObjectId = mongoose.Schema.Types.ObjectId;
let episodesSchema = new mongoose.Schema({
    movieID: {
        type: String
    },
    name: {
        type: String
    },
    url: {type: String},
    urlThumnail: {type: String},
    capcha: {type: String},
    view: {type: Number},
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});


episodesSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = Date.now();
        this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
})


episodesSchema.statics = {
    findA: function (id,cb) {
        return this.find({ _id: id }).sort('meta.createAt').exec(cb);
    },
    findAll: function (cb) {
        return this.find({}).sort('meta.createAt').exec(cb);
    },
    findById: function (id, cb) {
        return this.findOne({ _id: id }).exec(cb);
    },    
};

module.exports = episodesSchema;
