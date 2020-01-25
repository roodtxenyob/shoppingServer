let express: any = require('express');
let user: any = require('../model/user');
let md5:any = require('md5');
const router = express.Router();

/* GET home page. */
// router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
//   res.render('index', { title: 'Express hello' });
// });

router.post('/api/islogin', (request:any,response:any) => {
  let sql:string = `SELECT * FROM user WHERE token = '${request.body.token}'`;
  user.query(sql,(err:any,result:any) => {
    if(err){
      return response.status(500).json({ 'statusCode' : -1, 'info': '服务器忙请稍后再试' });  
    }
    if(result.length != 0){
      return response.status(200).json({ 'statusCode' : 1 , 'info': '状态为在线' , 'userInfo':result});
    }else{
      var updataSQL = 'UPDATE user SET token = ? WHERE username = ?';
      var updataInfo = ['0',request.body.username];
      user.query(updataSQL,updataInfo, (err:any,result:any):any => {
        if(err){
          console.log(err.message);
          return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
        }
      });
      return response.status(200).json({ 'statusCode' : 0 , 'info': '状态为离线，或者过期'});
    }
    
  });
});

router.post('/api/login', (request: any, response: any) => {
  let sql: string = `SELECT * FROM user WHERE username ='${request.body.username}' AND password = '${request.body.password}';`;
  user.query(sql, function (err: any, result: any) {
    if (err) {
      return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
    }
    if (result.length != 0) {
      let token = md5(md5(request.body.username + request.body.password + "mm")+"dd");
      var updataSQL = 'UPDATE user SET token = ? WHERE username = ?';
      var updataInfo = [token,request.body.username];
      user.query(updataSQL,updataInfo, (err:any,result:any):any => {
        if(err){
          console.log(err.message);
          return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
        }
      });

      return response.status(200).json({ 'statusCode': 1, 'info': '登陆成功' , "token" : token});
    }
    return response.status(200).json({ 'statusCode': '0', 'info': '登录失败' });
  });
  //user.end();
})
router.post('/api/register', (request: any, response: any): any => {
  user.query(`SELECT * FROM user WHERE username ='${request.body.username}'`, (err: any, result: any): any => {
    if (err) {
      return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
    }
    if (result.length != 0) {
      return response.status(200).json({ 'statusCode': 1, 'info': '用户名已存在' });
    }
    let sql = `INSERT INTO user(Id,password,username,power) VALUES(0,?,?,?)`;
    let sqlInfo = [request.body.password, request.body.username, 1];
    user.query(sql, sqlInfo, (err: any, result: any): any => {
      if (err) {
        console.log(err.message)
        return response.status(500).json({ 'statusCode': -1, 'info': '服务器忙请稍后再试' });
      }
      let token = md5(md5(request.body.username + request.body.password + "mm")+"dd");
      return response.status(200).json({ 'statusCode': 1, 'info': '注册成功' , "token" : token});
    });
  });

})
export default router;