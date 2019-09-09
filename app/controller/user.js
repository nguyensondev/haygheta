/*
 * @Author: bxm09
 * @Date:   2017-07-18 20:00:04
 * @Last Modified by:   bxm09
 * @Last Modified time: 2017-07-20 08:16:28
 */

/**
 * 处理用户控制逻辑
 */

const userModel = require('../model/mongoose/model/userModel');
const typeModel = require('../model/mongoose/model/typeModel');
const _ = require('underscore');

/**
 * 用户权限中间件
 * 判断用户是否登录
 *     若未登录（无 session），就重定向到登录页
 */
exports.user_req = function (req, res, next) {
    let user = req.session.user;

    if (!user) {
        console.log('Không đăng nhập,  thì không có quyền truy cập!')
        return res.redirect('/signin');
    }

    next();
};

/**
 * 用户权限中间件
 * 判断用户角色
 */
exports.admin_req = function (req, res, next) {
    let user = req.session.user;
    // console.log(user.role)

    if (user.role !== 100 && user.role !== 200) {
        return res.redirect('/');
    }

    next();
};

/**
 * 登录页
 */
exports.show_signup = function (req, res) {
    res.render('signup', {
        title: 'Trang Đăng Ký'
    });
};

/**
 * 注册页
 */
exports.show_signin = function (req, res) {
    res.render('signin', {
        title: 'Trang Đăng Nhập'
    });
};

/**
 * 用户注册逻辑
 * 先拿到 post 过来的 name、password 值，去数据库中查询，
 *     若 name 存在，返回 “用户名已存在”；
 *     若 name 不存在，就存到数据库，返回 “注册成功”。
 */
exports.signup = function (req, res) {
    let userObj = req.body.user;
    // let userObj = req.param('user'); // deprecated

    // console.log(userObj); // { name: '1', password: '2' }

    userModel.findOne({ name: userObj.name }, function (err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            // 重定向
            console.log('Đăng ký thất bại, tên người dùng đã tồn tại!')
            return res.redirect('/signup');
        } else {
            let newUser = new userModel(userObj);
            let idAvatar = Math.floor(Math.random() * 6) + 1;
            newUser.avatar = "https://i.imacdn.com/vg/default-avatar-"+idAvatar+".png"
            newUser.save(function (err, user) {
                if (err) {
                    console.log(err);
                }

                // console.log(newUser);

                // 重定向
                console.log('Đăng ký thành công!')
                res.redirect('/signin');
            });
        }
    });
};

/**
 * 用户登录逻辑
 * 先拿到 post 过来的 name、password 值，去数据库中查询，
 *     若 name 不存在，返回 “用户名不存在”；
 *     若 name 存在，将 post 过来的 password 值与 数据库中的 password 值比对
 *         若不一致，返回 “密码错误”；
 *         若一直，返回 “登录成功”。
 */
exports.signin = function (req, res) {
    let userObj = req.body.user;
    let name = userObj.name;
    let password = userObj.password;

    // 在数据库中查询
    userModel.findOne({ name: name }, function (err, result) {
        if (err) {
            console.log(err);
        }

        if (!result) {
            console.log('Đăng nhập thất bại, tên người dùng không tồn tại!');
            return res.redirect('/signin');
        }

        result.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                // session 存储
                req.session.user = result;

                console.log('Đăng nhập thành công!');
                //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                //return res.redirect('back');
                return res.redirect('/');
            } else {
                console.log('Đăng nhập thất bại, mật khẩu sai!');
                return res.redirect('/signin');
            }
        });
    })
};

/**
 * 用户注销逻辑
 * 删除该用户的 session
 */
exports.user_logout = function (req, res) {
    delete req.session.user;

    // 重定向
    console.log('注销成功！')
    res.redirect('/');
};

/**
 * 用户列表页逻辑
 * 取到用户的 session，
 */
exports.user_list = function (req, res) {
    userModel.findAll(function (err, users) {
        if (err) {
            console.log(err);
        }

        res.render('user_list', {
            title: 'Trang quản lý người dùng',
            users: users
        });
    });
};

/**
 * 存储一个新用户存储页
 */
exports.add_user = function (req, res) {
    res.render('add_user', {
        title: 'Trang thêm người dùng',
        user: {
            name: '',
            password: '',
            role: 10
        }
    });
};

/**
 * 用户录入逻辑
 */
exports.save_user = function (req, res) {
    let id = req.body.user._id;
    let userObj = req.body.user;
    let postUser = null;

    // 若 id 存在则更新，不存在就创建
    if (id) {
        console.log('Lưu không thành công và tên người dùng đã tồn tại!');

        userModel.findById(id, function (err, user) {
            if (err) {
                console.log(err);
            }

            // postUser = Object.assign({}, user, movieObj);
            // 用 underscore 替换对象
            postUser = _.extend(user, userObj);
            postUser.save(function (err, user) {
                if (err) {
                    console.log(err);
                }

                // 重定向
                res.redirect('/admin/user_list');
            });
        });
    } else {
        postUser = new userModel({
            name: userObj.name,
            password: userObj.password,
            role: userObj.role
        });

        postUser.save(function (err, user) {
            if (err) {
                console.log(err);
            }

            // 重定向
            res.redirect('/admin/user_list');
        });
    }
};

// 修改用户
exports.user_update = function (req, res) {
    let id = req.params.id;
    console.log(id)

    if (id) {
        userModel.findById(id, function (req, user) {
            res.render('add_user', {
                title: 'Trang sửa thông tin người dùng',
                user: user
            });
        });
    }
};

// 删除用户
exports.user_delete = function (req, res) {
    let id = req.query.id;

    if (id) {
        userModel.remove({ _id: id }, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        });
    }
};
