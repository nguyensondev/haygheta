/*
 * @Author: bxm09
 * @Date:   2017-07-20 00:19:07
 * @Last Modified by:   bxm09
 * @Last Modified time: 2017-07-20 07:09:43
 */

/**
 * 电影评论逻辑
 */

const homeModel = require('../model/mongoose/model/homeModel');


exports.add_intro = function (req, res) {
    res.render('add_intro', {
        title: 'Trang thêm intro',
        home: {
            urlImage: '',
            link: ''
        }
    });
};

exports.save_intro = function (req, res) {
    let _home = req.body.home;
    // console.log(_category); // { name: '普通分类' }

    let home = new homeModel(_home);

    home.save(function(err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect(req.get('referer'));
    });
}
