/*
 * @Author: bxm09
 * @Date:   2017-07-18 01:00:22
 * @Last Modified by:   bxm09
 * @Last Modified time: 2017-07-20 09:32:58
 */

const indexController = require('../app/controller/index');
const movieController = require('../app/controller/movie');
const userController = require('../app/controller/user');
const commentController = require('../app/controller/comment');
const categoryController = require('../app/controller/category');

module.exports = function (app) {
    /**
     * pre handle user
     * 不推荐使用 app.locals.user = req.session.user; 避免别的客户端也拿到了 user，造成环境污染
     * user 的 session 信息存放在 res.locals 中变成本次生命周期变量，在每个模板页面中都能拿到，不用每次都用 render 传递 user
     */
    app.use(function (req, res, next) {
        res.locals.user = req.session.user;
       // console.log(req.session)
        //res.setHeader('Access-Control-Allow-Origin', '*');
        // const removeOnRoutes = '/detail';
        // req.originalUrl = req.originalUrl.replace(removeOnRoutes,'/anime');
        // req.path = req.path.replace(removeOnRoutes,'/anime');
        // Request methods you wish to allow
        //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        //res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
        next();
    });
    //search_movie
    // index
    app.get('/', indexController.index);
    app.post('/admin/get_list_episode',  movieController.getListEpisodes);
    app.get('/admin/get_a_episode/:id',  movieController.get_a_episode);
    app.get('/admin/get_list_episode/:id', movieController.get_list_episode);
    // movie
    app.get('/search2/:query/:type', movieController.result_search_movie);
    app.get('/search/:query/:type', movieController.search_movie);
    app.get('/anime/:id/:episodesID', movieController.detail);
    app.get('/admin/add_type', userController.user_req, userController.admin_req, movieController.add_type);
    app.get('/admin/add_group', userController.user_req, userController.admin_req, movieController.add_group);
    app.post('/admin/save_type', userController.user_req, userController.admin_req, movieController.save_type);
    app.post('/admin/save_group', userController.user_req, userController.admin_req, movieController.save_group);
    app.get('/admin/episodes_list/:id', userController.user_req, userController.admin_req, movieController.episodes_list);
    app.get('/admin/add_episodes/:id', userController.user_req, userController.admin_req, movieController.add_episodes);
    app.post('/admin/save_episodes', userController.user_req, userController.admin_req, movieController.save_episodes);
    app.post('/admin/edit_episodes', userController.user_req, userController.admin_req, movieController.edit_episodes);
    app.post('/admin/upload_thumnail_episodes', userController.user_req, userController.admin_req, movieController.upload_thumnail_episodes);
    app.post('/admin/upload_episodes', userController.user_req, userController.admin_req, movieController.upload_episodes);
    app.get('/admin/add_movie', userController.user_req, userController.admin_req, movieController.add_movie);
    app.post('/admin/new', userController.user_req, userController.admin_req, movieController.movie_save);
    app.get('/admin/movie_list', userController.user_req, userController.admin_req, movieController.movie_list);
    app.get('/admin/movie_update/:id', userController.user_req, userController.admin_req, movieController.movie_update);
    app.get('/admin/update_episodes/:id', userController.user_req, userController.admin_req, movieController.update_episodes);
    app.delete('/admin/movie_list', userController.user_req, userController.admin_req, movieController.movie_delete);

    // comment
    app.post('/detail/comment', userController.user_req, commentController.comment_save);
    app.post('/detail/reply_comment', userController.user_req, commentController.reply_comment);
    app.get('/detail/get_comments/:id', commentController.get_comments);
    // category
    app.get('/admin/add_category', userController.user_req, userController.admin_req, categoryController.add_category);
    app.post('/admin/save_category', userController.user_req, userController.admin_req, categoryController.save_category);
    app.get('/admin/category_list', userController.user_req, userController.admin_req, categoryController.category_list);

    // user
    app.get('/signup', userController.show_signup);
    app.get('/signin', userController.show_signin);
    app.post('/user/signup', userController.signup);
    app.post('/user/signin', userController.signin);
    app.get('/user_logout', userController.user_logout);
    app.get('/admin/add_user', userController.user_req, userController.admin_req, userController.add_user);
    app.post('/admin/save_user', userController.user_req, userController.admin_req, userController.save_user);
    app.get('/admin/user_list', userController.user_req, userController.admin_req, userController.user_list);
    app.get('/admin/user_update/:id', userController.user_req, userController.admin_req, userController.user_update);
    app.delete('/admin/user_list', userController.user_req, userController.admin_req, userController.user_delete);
};
