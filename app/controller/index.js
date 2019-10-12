/*
 * @Author: bxm09
 * @Date:   2017-07-18 19:48:12
 * @Last Modified by:   bxm09
 * @Last Modified time: 2017-07-20 10:14:37
 */

/**
 * 处理首页控制逻辑
 */
const homeModel = require('../model/mongoose/model/homeModel');
const movieModel = require('../model/mongoose/model/movieModel');
const groupModel = require('../model/mongoose/model/groupModel');
const typeModel = require('../model/mongoose/model/typeModel');
// index page
exports.index = function (req, res) {
    // console.log(req.session.user);

    // user 的 session 信息存放在 locals 中变成本地变量，在每个模板页面中都能拿到，不用每次都用 render 传递 user
    // app.locals.user = req.session.user;

    movieModel.findAll(function (err, movies) {
        if (err) {
            console.log(err);
        }
        groupModel.findAll(function (err, groups) {
            if (err) {
                console.log(err);
            }
            typeModel.findAll(function (err, types) {
                if (err) {
                    console.log(err);
                }

                homeModel.findAll(function (err, intro) {
                    if (err) {
                        console.log(err);
                    }
    
                    res.render('index', {
                        title: 'Hay Ghê Ta',
                        movies: movies,
                        groups: groups,
                        types: types,
                        userCurrent: req.session.user,
                        intro:intro
                    });
                });
            });

        });
    });
};
