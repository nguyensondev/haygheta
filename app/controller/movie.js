/*
 * @Author: bxm09
 * @Date:   2017-07-18 20:21:30
 * @Last Modified by:   bxm09
 * @Last Modified time: 2017-07-20 10:19:37
 */

/**
 * 处理电影控制逻辑
 */
var formidable = require('formidable');
const movieModel = require('../model/mongoose/model/movieModel');
const categoryModel = require('../model/mongoose/model/categoryModel');
const episodesModel = require('../model/mongoose/model/episodesModel');
const commentModel = require('../model/mongoose/model/commentModel');
const groupModel = require('../model/mongoose/model/groupModel');
const typeModel = require('../model/mongoose/model/typeModel');
const _ = require('underscore');
const openload = require('node-openload');
const ol = openload({
    api_login: "25c363bb39ee91f2",
    api_key: "UmUrpthb",
});

// GET detail page.
exports.detail = function (req, res) {
    // 取到 url '/detail/:id' 中的 id
    let id = req.params.id;

    movieModel.findById(id, function (err, movie) {
        // 取到该电影的评论数据
        episodesModel.find({ movieID: id }, function (err, episodes) {
            console.log(episodes);

            if (err) {
                console.log(err);
            }
            let defaultURl = ""
            let thumnail = ""
            if (episodes.length > 0) {
                defaultURl = episodes[episodes.length - 1].url
                thumnail = episodes[episodes.length - 1].urlThumnail
            }
            res.render('detail', {
                title: 'Trang chi tiết phim',
                movie: movie,
                episodes: episodes,
                defaultURl: defaultURl,
                thumnailURL: thumnail
            });
        });
        // commentModel.find({ movie: id }, function (err, comments) {
        //     console.log(comments);

        //     if (err) {
        //         console.log(err);
        //     }

        //     res.render('detail', {
        //         title: 'Trang chi tiết phim',
        //         movie: movie,
        //         comments: comments
        //     });
        // });

    });
};
// GET add_episodes page.
exports.add_episodes = function (req, res) {
    // 取到 url '/detail/:id' 中的 id
    let id = req.params.id;
    res.render('add_episodes', {
        title: 'Trang thêm tập phim',
        id: id
    });
};
exports.upload_episodes = function (req, res) {
    // 取到 url '/detail/:id' 中的 id

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //var oldpath = files.filetoupload.path;
        console.log(files.fileUploaded.path);
        ol.upload({
            file: files.fileUploaded.path
        }, (result) => {
            res.setHeader('Content-Type', 'application/json');
            //console.log(result);
            res.send({ result: result.percent });
        }).then(data => {
            /*
            {   name: 'upload_30a5a1034c54130a075c424c4675ff00',
                size: '383631',
                sha1: '5c5a07267317b166a218e5edb7667ccd2b5351be',
                content_type: 'video/mp4',
                id: 'hmWnolACq-A',
                url:
                'https://openload.co/f/hmWnolACq-A/upload_30a5a1034c54130a075c424c4675ff00' } 
             */
            console.log(data);
        })
    });

};
// save_episodes page - post
exports.save_type = function (req, res) {
    let _type = req.body.type;
    //console.log(_episodes); // { name: '普通分类' }   
    let type = new typeModel(_type);

    type.save(function (err, epi) {
        if (err) {
            console.log(err);
        }

        res.redirect(req.get('referer'));
    });
};
// save_episodes page - post
exports.save_group = function (req, res) {
    let _group = req.body.group;
    //console.log(_episodes); // { name: '普通分类' }   
    let group = new groupModel(_group);

    group.save(function (err, epi) {
        if (err) {
            console.log(err);
        }

        res.redirect(req.get('referer'));
    });
};
// save_episodes page - post
exports.save_episodes = function (req, res) {
    let _episodes = req.body.episodes;
    // let temp = _episodes.url.replace(/\s/g, '')
    // let array = temp.toString().split(',')
    // _episodes["url"] = array
    // let episodes = new episodesModel(_episodes);

    // episodes.save(function (err, epi) {
    //     if (err) {
    //         console.log(err);
    //     }

    //     res.redirect(req.get('referer'));
    // });
    let temp = _episodes.url.replace(/\s/g, '')
    let array = temp.toString().split('/')
    if (array && array.length > 0) {
        let id = array[4]
        console.log("id ", id);
        ol.getDownloadTicket(id).then(info => {
            console.log(info)
            if (info) {
                // nếu không yêu cầu capcha thì call api lấy link phim non catcha
                if (!info.captcha_url) {
                    ol.getDownloadLink({
                        file: id,
                        ticket: info.ticket,

                    })
                        .then(data => {
                            // lưu link lấy được vào database
                            if (data) {
                                _episodes.url = data.url
                                let episodes = new episodesModel(_episodes);
                                console.log("cuoi cung", episodes);
                                episodes.save(function (err, epi) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    res.redirect(req.get('referer'));
                                })
                            }
                        });
                }
                else if (_episodes.capcha != null) {
                    // vall api với capcha và lưu lại
                    ol.getDownloadLink({
                        file: id,
                        ticket: info.ticket,
                        captcha_response: _episodes.capcha
                    })
                        .then(data => {
                            // lưu link lấy được vào database
                            if (data) {
                                _episodes.url = data.url
                                let episodes = new episodesModel(_episodes);
                                console.log("cuoi cung capcha", episodes);
                                episodes.save(function (err, epi) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    res.redirect(req.get('referer'));
                                })
                            }
                        });
                }
                else {
                    // hiện trang có capcha để nhập
                    _episodes.capcha = info.captcha_url//'https://openload.co/dlcaptcha/t7PsyNwD701iirn2.png'//info.captcha_url
                    res.render('add_episodes', {
                        title: 'Trang thêm tập phim',
                        id: _episodes.movieID,
                        _episodes: _episodes
                    });
                }
            }
        });
    }


};

// GET add_movie page.
exports.add_movie = function (req, res) {
    categoryModel.findAll(function (err, categorys) {
        if (err) {
            console.log(err);
        }
        typeModel.findAll(function (err, types) {
            if (err) {
                console.log(err);
            }
            groupModel.findAll(function (err, groups) {
                if (err) {
                    console.log(err);
                }
                res.render('add_movie', {
                    title: 'Phim demo',
                    movie: {
                        title: 'Chiến tranh cơ khí',
                        titleVN: 'Fate stay night',
                        doctor: 'Jose Mediterra',
                        country: 'Hoa Kỳ',
                        year: '2014',
                        poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
                        flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
                        summary: 'Biên tập viên chiến tranh cơ học "Chiến binh cơ khí" là một bộ phim khoa học viễn tưởng của đạo diễn Jose Padilla, với sự tham gia của Joel Ginnerman, Samuel Jackson, Gary Oldman, v.v., được chuyển thể từ năm 1987 Bộ phim cùng tên của đạo diễn Paul Van Hoven. Bộ phim được phát hành tại Hoa Kỳ vào ngày 12 tháng 2 năm 2014 và được phát hành tại Trung Quốc đại lục vào ngày 28 tháng 2 năm 2014. Bối cảnh câu chuyện của bộ phim về cơ bản giống với nguyên tác. Câu chuyện lấy bối cảnh tại Detroit năm 2028. Nam chính Alex Murphy là một cảnh sát chính trực. Quả bom được cài bởi kẻ xấu trong xe bị thương nặng. Để cứu anh ta, OmniCorp đã biến anh thành một robot "chiến binh máy" sinh hóa đại diện cho tương lai của công lý Mỹ.',
                        language: 'Tiếng anh'
                    },
                    category: categorys,
                    group: groups,
                    type: types
                });
            })
        })

    });

};

exports.add_group = function (req, res) {
    res.render('add_group', {
        title: 'Trang nhập nhóm',
        group: {
            name: 'Thể loại chung',
            id: 1
        }
    });
};

exports.add_type = function (req, res) {
    res.render('add_type', {
        title: 'Trang nhập loại anime',
        type: {
            name: 'Thể loại chung',
            id: 1
        }
    });
};
// add_movie page - post
exports.movie_save = function (req, res) {
    let id = req.body.movie._id;
    let movieObj = req.body.movie;
    let postMovie = null;
    console.log(movieObj);
    // 若 id 存在则更新，不存在就创建
    if (id) {
        movieModel.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }

            // postMovie = Object.assign({}, movie, movieObj);
            // 用 underscore 替换对象
            postMovie = _.extend(movie, movieObj);
            postMovie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                // 重定向
                res.redirect('/detail/' + movie._id);
            });
        });
    } else {
        postMovie = new movieModel({
            title: movieObj.title,
            doctor: movieObj.doctor,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            flash: movieObj.flash,
            summary: movieObj.summary,
            titleVN: movieObj.titleVN,
            group: movieObj.group,
            type: movieObj.type
        });

        postMovie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            // 重定向
            res.redirect('/detail/' + movie._id);
        });
    }
};

// GET movie-list page.
exports.movie_list = function (req, res) {

    movieModel.findAll(function (err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('movie_list', {
            title: 'Trang quản lý danh sách phim',
            movies: movies
        });
    });
};

// GET episodes-list page.
exports.episodes_list = function (req, res) {
    let id = req.params.id;
    //let id = "5d37cd39a3c15527bcc61a17";   
    episodesModel.find({
        "movieID": id
    }, function (err, epi) {
        if (err) {
            console.log(err);
        }
        res.render('episodes_list', {
            title: 'Trang quản lý danh sách tập',
            episodes: epi
        });
    }).slice();
};

// movie- page - update
exports.movie_update = function (req, res) {
    let id = req.params.id;

    if (id) {
        movieModel.findById(id, function (req, movie) {
            res.render('add_movie', {
                title: 'Trang thêm phim mới',
                movie: movie
            });
        });
    }
};

// movie- page - delete
exports.movie_delete = function (req, res) {
    let id = req.query.id;

    if (id) {
        movieModel.remove({ _id: id }, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        });
    }
};
