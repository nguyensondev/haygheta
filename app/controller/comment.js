/*
 * @Author: bxm09
 * @Date:   2017-07-20 00:19:07
 * @Last Modified by:   bxm09
 * @Last Modified time: 2017-07-20 07:09:43
 */

/**
 * 电影评论逻辑
 */

const commentModel = require('../model/mongoose/model/commentModel');

exports.comment_save = function (req, res) {
    let commentEntity = new commentModel();
    commentEntity.movie = req.body.movieID
    commentEntity.from = req.body.user._id
    commentEntity.fromName = req.body.user.name
    commentEntity.fromAvatar = req.body.user.avatar
    commentEntity.content = req.body.content
    commentEntity.id = new Date().getTime()
    commentEntity.save(function (err, comment) {
        if (err) {
            console.log(err);
        }

        // 重定向
        res.status(200).send({
            success: 'true',
            message: 'save successfully',
            data: comment
        })
        //res.redirect('/detail/' + movie_id);
    });
};

exports.reply_comment = function (req, res) {
    commentModel.find({ id: req.body.id }, function (err, comments) {
        if (comments.length > 0) {
            let commentEntity = {}
            let array = comments[0].reply
            commentEntity.fromName = req.body.user.name
            commentEntity.fromAvatar = req.body.user.avatar
            commentEntity.content = req.body.content
            commentEntity.id = new Date().getTime()
            array.push(commentEntity)
            commentModel.update(
                { "id": req.body.id},
                { "$set": { "reply": array } },
                function (err, raw) {
                    if (err) {
                        console.log('Error log: ' + err)
                    } else {
                        console.log(raw);
                        return res.status(200).send({
                            success: 'true',
                            message: 'update comment successfully',
                            data: commentEntity.id
                        })
                    }
                }
            );
        } else {
            res.status(404).send({
                success: 'false',
                message: 'not found',
                data: null
            })
        }

    })
};

exports.get_comments = function (req, res) {
    let movieID = req.params.id


    commentModel.find({ movie: movieID }, function (err, comments) {
        if (comments.length > 0) {
            res.status(200).send({
                success: 'true',
                message: 'get successfully',
                data: comments
            })
        } else {
            res.status(404).send({
                success: 'false',
                message: 'not found',
                data: null
            })
        }

    })
}
