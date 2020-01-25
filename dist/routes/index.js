"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var user = require('../model/user');
var md5 = require('md5');
var router = express.Router();
/* GET home page. */
// router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
//   res.render('index', { title: 'Express hello' });
// });
router.post('/api/islogin', function (request, response) {
    var sql = "SELECT * FROM user WHERE token = '" + request.body.token + "'";
    user.query(sql, function (err, result) {
        if (err) {
            return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
        }
        if (result.length != 0) {
            return response.status(200).json({ 'statusCode': 1, 'info': '状态为在线', 'userInfo': result });
        }
        else {
            var updataSQL = 'UPDATE user SET token = ? WHERE username = ?';
            var updataInfo = ['0', request.body.username];
            user.query(updataSQL, updataInfo, function (err, result) {
                if (err) {
                    console.log(err.message);
                    return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
                }
            });
            return response.status(200).json({ 'statusCode': 0, 'info': '状态为离线，或者过期' });
        }
    });
});
router.post('/api/login', function (request, response) {
    var sql = "SELECT * FROM user WHERE username ='" + request.body.username + "' AND password = '" + request.body.password + "';";
    user.query(sql, function (err, result) {
        if (err) {
            return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
        }
        if (result.length != 0) {
            var token = md5(md5(request.body.username + request.body.password + "mm") + "dd");
            var updataSQL = 'UPDATE user SET token = ? WHERE username = ?';
            var updataInfo = [token, request.body.username];
            user.query(updataSQL, updataInfo, function (err, result) {
                if (err) {
                    console.log(err.message);
                    return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
                }
            });
            return response.status(200).json({ 'statusCode': 1, 'info': '登陆成功', "token": token });
        }
        return response.status(200).json({ 'statusCode': '0', 'info': '登录失败' });
    });
    //user.end();
});
router.post('/api/register', function (request, response) {
    user.query("SELECT * FROM user WHERE username ='" + request.body.username + "'", function (err, result) {
        if (err) {
            return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
        }
        if (result.length != 0) {
            return response.status(200).json({ 'statusCode': 1, 'info': '用户名已存在' });
        }
        var sql = "INSERT INTO user(Id,password,username,power) VALUES(0,?,?,?)";
        var sqlInfo = [request.body.password, request.body.username, 1];
        user.query(sql, sqlInfo, function (err, result) {
            if (err) {
                console.log(err.message);
                return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
            }
            var token = md5(md5(request.body.username + request.body.password + "mm") + "dd");
            return response.status(200).json({ 'statusCode': 1, 'info': '注册成功', "token": token });
        });
    });
});
exports.default = router;
