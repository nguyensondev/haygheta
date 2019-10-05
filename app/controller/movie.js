/*
 * @Author: bxm09
 * @Date:   2017-07-18 20:21:30
 * @Last Modified by:   bxm09
 * @Last Modified time: 2017-07-20 10:19:37
 */

/**
 * 处理电影控制逻辑
 */
// var request = require('request');
var formidable = require('formidable');
const movieModel = require('../model/mongoose/model/movieModel');
const categoryModel = require('../model/mongoose/model/categoryModel');
const episodesModel = require('../model/mongoose/model/episodesModel');
const commentModel = require('../model/mongoose/model/commentModel');
const groupModel = require('../model/mongoose/model/groupModel');
const typeModel = require('../model/mongoose/model/typeModel');
const _ = require('underscore');
const url = require('url');
var request = require('request');
const openload = require('node-openload');
const ol = openload({
    api_login: "25c363bb39ee91f2",
    api_key: "UmUrpthb",
});

exports.getListEpisodes = function (req, res) {
    episodesModel.find({ movieID: req.params.movieID }, function (err, episodes) {
        if (episodes.length > 0) {
            res.status(200).send({
                success: 'true',
                message: 'get successfully',
                data: episodes
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

function getEpisode(episodes, res) {
    request({ method: 'HEAD', uri: episodes.url }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("link con song")
            return res.status(200).send({
                success: 'true',
                message: 'get successfully',
                data: episodes
            })
        } else {
            console.log("link da chet ")
            ol.getDownloadTicket(episodes.videoID).then(info => {
                ol.getDownloadLink({
                    file: episodes.videoID,
                    ticket: info.ticket,
                })
                    .then(data2 => {
                        if (data2) {
                            episodes.url = data2.url
                            episodesModel.update(
                                { "_id": episodes._id },
                                { "$set": { "url": data2.url } },
                                function (err, raw) {
                                    if (err) {
                                        console.log('Error log: ' + err)
                                    } else {
                                        console.log(raw);
                                        return res.status(200).send({
                                            success: 'true',
                                            message: 'get successfully',
                                            data: episodes
                                        })
                                    }
                                }
                            );

                        }
                    });
            })

        }
    })
}

exports.get_a_episode = function (req, res) {
    if (req.params.id === "-1") {
        episodesModel.findOne({}, {}, { sort: { 'created_at': 1 } }, function (err, post) {
            getEpisode(post, res);
        });
    } else {
        episodesModel.find({ episodeNameNon: req.params.id }, function (err, episodes) {
            if (episodes.length > 0) {
                getEpisode(episodes[0], res);
            } else {
                return res.status(404).send({
                    success: 'false',
                    message: 'not found',
                    data: null
                })
            }

        })
    }


}

exports.get_list_episode = function (req, res) {
    let id = req.params.id
    episodesModel.find({ movieID: id }, function (err, episodes) {
        return res.status(200).send({
            success: 'true',
            message: 'get successfully',
            data: episodes
        })
    })

}

// GET detail page.
exports.detail = function (req, res) {
    // 取到 url '/detail/:id' 中的 id
    let id = req.params.id;
    let episodesID = req.params.episodesID;
    console.log("episodesID ", episodesID)
    console.log("id ", id)
    let currentEpisole;
    let lstEpisoles = []
    movieModel.find({ titleNon: id }, function (err, movie) {
        if (episodesID === "-1") {
            episodesModel.find({ movieID: movie[0]._id }, function (err, episodes) {
                res.redirect(url.format({
                    pathname: "/anime/" + movie[0].titleNon + "/" + episodes[0].episodeNameNon,
                }));
            })
        }
        else {
            
            episodesModel.find({
                "movieID": movie[0]._id
            }, function (err, epi) {
                if (err) {
                    console.log(err);
                }
                if (epi.length > 0) {
                    epi.forEach(episodes => {
                        if (episodes.episodeNameNon === episodesID) {
                            currentEpisole = episodes
                        }
                        lstEpisoles.push({
                            "_id": episodes._id, name: episodes.name,
                            episodeNameNon: episodes.episodeNameNon, movieID: episodes.movieID
                        })
                    });
                    if (currentEpisole === undefined || currentEpisole === null) {
                        res.status(404).send({
                            success: 'false',
                            message: 'not found episodes',
                            data: null
                        })
                    } else {
                        commentModel.find({ movie: currentEpisole.movieID }, function (err, comments) {
                            res.render('detail', {
                                title: currentEpisole.episodeName + "/"+movie[0].title,
                                movie: movie[0],
                                episodes: currentEpisole,
                                lstEpisodes:lstEpisoles,
                                user: req.session.user,
                                comments: comments
                            });
                        })
                    }
                }
                else {
                    res.status(404).send({
                        success: 'false',
                        message: 'not found movie episodes',
                        data: null
                    })
                }
            })
            
            // 取到该电影的评论数据
            // res.render('detail', {
            //     title: 'React native',
            //     movie: movie[0],
            //     episodesID: episodesID,
            //     user: req.session.user
            // });
        }

        // episodesModel.find({ movieID: id }, function (err, episodes) {


        //     if (err) {
        //         console.log(err);
        //     }
        //     let defaultURl = ""
        //     let thumnail = ""
        //     if (episodes.length > 0) {

        //         if (episodesID === "-1") {
        //             defaultURl = episodes[episodes.length - 1].url
        //             thumnail = episodes[episodes.length - 1].urlThumnail
        //             res.render('detail', {
        //                 title: 'Trang chi tiết phim',
        //                 movie: movie,
        //                 episodes: episodes,
        //                 defaultURl: defaultURl,
        //                 thumnailURL: thumnail,
        //                 episodesID: episodesID
        //             });
        //         }
        //         else {
        //             // episodes.map(item => {
        //             //     console.log(item._id);
        //             //     if (item._id === episodesID) {
        //             //         defaultURl = item.url
        //             //         thumnail = item.urlThumnail
        //             //     }
        //             // })
        //             //let temps = output = episodes.filter(function(value){ return value._id==episodesID;})
        //             res.render('detail', {
        //                 title: 'Trang chi tiết phim',
        //                 movie: movie,
        //                 episodes: episodes,
        //                 defaultURl: "",
        //                 thumnailURL: "",
        //                 episodesID: episodesID
        //             });
        //         }

        //     }

        // });
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

// movie- page - update
exports.update_episodes = function (req, res) {
    let id = req.params.id;

    if (id) {
        episodesModel.findById(id, function (req, episodes) {
            res.render('update_episodes', {
                title: 'Trang sửa tập phim',
                episodes: episodes
            });
        });
    }
};
exports.upload_thumnail_episodes = function (req, res) {
    console.log(req.body.filename)
    ol.upload({
        file: req.body.filename
    }, (result) => {
        console.log(result)
    }).then(data => {
        console.log("up duoc ", data)
    })
    // var form = new formidable.IncomingForm();

    // form.parse(req, function (err, fields, files) {
    //     console.log(files.upload.path)
    //     // if(files.upload.path){
    //     //     ol.upload({
    //     //         file: files.upload.path
    //     //     }, (result) => {
    //     //         console.log(result)
    //     //     }).then(data => {

    //     //     })   
    //     // }

    // })

};
exports.edit_episodes = function (req, res) {
    let id = req.body.episodes._id;
    let episodesObj = req.body.episodes;
    let postEpisodes = null;
    let linkDrive = "https://docs.google.com/uc?id="
    if (episodesObj.urlThumnail && episodesObj.urlThumnail.indexOf("file") > -1) {
        let array = episodesObj.urlThumnail.toString().split('/')
        episodesObj.urlThumnail = linkDrive + array[5]
    }
    let name = remove_unicode(episodesObj.name.replace(new RegExp(" ", 'g'), "-"))
    let episodeName = remove_unicode(episodesObj.episodeName.replace(new RegExp(" ", 'g'), "-"))
    episodesObj.episodeNameNon = (name + "-" + episodeName).replace(" ", "")
    if (id) {
        episodesModel.findById(id, function (err, episode) {
            if (err) {
                console.log(err);
            }

            // postMovie = Object.assign({}, movie, movieObj);
            // 用 underscore 替换对象
            postEpisodes = _.extend(episode, episodesObj);
            postEpisodes.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                // 重定向
                res.redirect('/admin/update_episodes/' + movie._id);
            });
        });
    }
};
exports.upload_episodes = function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        console.log(files.upload)
        //console.log(fields.movieid)
        ol.upload({
            file: files.upload.path
        }, (result) => {
            console.log(result)
        }).then(data => {
            console.log(data)
            let temp = data.url.replace(/\s/g, '')
            let array = temp.toString().split('/')
            if (array && array.length > 0) {
                let id = data.id
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
                                .then(data2 => {
                                    // let url = "https://api.openload.co/1/file/getsplash?login=25c363bb39ee91f2&key=UmUrpthb&file=" + data.id
                                    // console.log("url ", url);
                                    // request(url, function (error, response, body) {
                                    //     console.log(response) 
                                    // })
                                    // lưu link lấy được vào database
                                    if (data2) {
                                        //_episodes.url = data.url
                                        let episodes = new episodesModel({
                                            "movieID": fields.movieid,
                                            "name": files.upload.name,
                                            "url": data2.url,
                                            "urlThumnail": "",
                                            "videoTicket": info.ticket,
                                            "videoID": id
                                        });
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
                        // else if (_episodes.capcha != null) {
                        //     // vall api với capcha và lưu lại
                        //     ol.getDownloadLink({
                        //         file: id,
                        //         ticket: info.ticket,
                        //         captcha_response: _episodes.capcha
                        //     })
                        //         .then(data => {
                        //             // lưu link lấy được vào database
                        //             if (data) {
                        //                 _episodes.url = data.url
                        //                 let episodes = new episodesModel(_episodes);
                        //                 console.log("cuoi cung capcha", episodes);
                        //                 episodes.save(function (err, epi) {
                        //                     if (err) {
                        //                         console.log(err);
                        //                     }
                        //                     res.redirect(req.get('referer'));
                        //                 })
                        //             }
                        //         });
                        // }
                        // else {
                        //     // hiện trang có capcha để nhập
                        //     _episodes.capcha = info.captcha_url//'https://openload.co/dlcaptcha/t7PsyNwD701iirn2.png'//info.captcha_url
                        //     res.render('add_episodes', {
                        //         title: 'Trang thêm tập phim',
                        //         id: _episodes.movieID,
                        //         _episodes: _episodes
                        //     });
                        // }
                    }
                });
            }
            //res.redirect(req.get('referer'));
        })
    });




    // form.on('fileBegin', function (name, file){
    //     file.path = __dirname + '/uploads/' + file.name;
    // });

    // form.on('file', function (name, file){
    //     console.log('Uploaded ' + file.name);
    // });

    // res.sendFile(__dirname + '/index.html');
    // 取到 url '/detail/:id' 中的 id
    //console.dir(req.body)
    //console.dir(req)
    // var form = new formidable.IncomingForm();
    // form.parse(req, function (err, fields, files) {
    //     //var oldpath = files.filetoupload.path;
    //     console.log(files);
    //     ol.upload({

    //     }, (result) => {
    //         //res.setHeader('Content-Type', 'application/json');
    //         //res.write(result.percent.toString());

    //         console.log(result);
    //         res.redirect(req.get('referer'));
    //     }).then(data => {
    //         //res.end()
    //         /*
    //         {   name: 'upload_30a5a1034c54130a075c424c4675ff00',
    //             size: '383631',
    //             sha1: '5c5a07267317b166a218e5edb7667ccd2b5351be',
    //             content_type: 'video/mp4',
    //             id: 'hmWnolACq-A',
    //             url:
    //             'https://openload.co/f/hmWnolACq-A/upload_30a5a1034c54130a075c424c4675ff00' } 
    //          */

    //         console.log(data);
    //         res.redirect(req.get('referer'));
    //     })
    //});

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
exports.save_episodes_new = function (req, res) {
    let _episodes = req.body.episodes;
    // let temp = _episodes.url.replace(/\s/g, '')
    // let array = temp.toString().split(',')
    // _episodes["url"] = array
    let episodes = new episodesModel(_episodes);

    episodes.save(function (err, epi) {
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
                                _episodes.videoTicket = info.ticket
                                _episodes.videoID = id
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
                                _episodes.videoTicket = info.ticket
                                _episodes.videoID = id
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
function remove_unicode(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");

    str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1- 
    str = str.replace(/^\-+|\-+$/g, "");

    return str.toLowerCase();
}
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
        let temp = remove_unicode(movieObj.title.replace(new RegExp(" ", 'g'), "-"))
        postMovie = new movieModel({
            title: movieObj.title,
            titleNon: temp,
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

// GET episodes-list page.
exports.search_movie = function (req, res) {
    let query = req.params.query;
    let type = req.params.type;
    let searchQuery
    //res.render('search2', {movies: [], query: query});

    if (type === "0") {
        searchQuery = {
            title: { $regex: query, $options: "i" }
        };
    } else {
        searchQuery = {
            title: { $regex: query, $options: "i" },
            type: { $regex: type, $options: "i" }
        };
    }
    movieModel.find(searchQuery, function (err, epi) {
        if (err) {
            console.log(err);
        }
        if (epi) {
            //res.redirect('/search2/fate/0');
            //console.log(epi);
            //res.render('search2', {movies: epi, query: query});
            return res.status(200).send({
                success: 'true',
                message: 'get successfully'
            })
        }
    });
};

exports.result_search_movie = function (req, res) {
    let query = req.params.query;
    let type = req.params.type;
    let searchQuery
    //res.render('search2', {movies: [], query: query});

    if (type === "0") {
        searchQuery = {
            title: { $regex: query, $options: "i" }
        };
    } else {
        searchQuery = {
            title: { $regex: query, $options: "i" },
            type: { $regex: type, $options: "i" }
        };
    }
    movieModel.find(searchQuery, function (err, epi) {
        if (err) {
            console.log(err);
        }
        if (epi) {
            res.render('search2', { movies: epi, query: query });
            //console.log(epi);
            //res.render('search2', {movies: epi, query: query});
            // return res.status(200).send({
            //     success: 'true',
            //     message: 'get successfully',
            //     data: epi
            // })
        }
    });
};
