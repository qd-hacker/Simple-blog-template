const express = require('express');
const router = express.Router();
const conn = require('./model.js');
const ctrl = require('./controller.js')
router.get('/register',(req,res)=>{
	res.render('./user/register.ejs',{})
})
// 提交新用户注册
router.post('/register', (req, res) => {
// 判断是否为空
if (req.body.username.length <= 0 || req.body.password.length <= 0 || req.body.nickname.length <= 0) {
    return res.json({ err_code: 1, message: '注册失败，请填写完整的表单数据！' })
  }
// 判断用户名是否被占用
conn.query('select count(*) as count from users2 where username=?',req.body.username,(err,results)=>{
	if(err) return res.json({err_code:1,message:'注册失败333'});
	if(results[0].count!=0) return res.json({err_code:1,message:'用户名被占用'});
conn.query('insert into users2 set ?',req.body,(err,results)=>{
	if(err) return res.json({err_code:1,message:'注册失败4444'});
	if(results.affectedRows!=1) return res.json({err_code:1,message:'注册失败'});
	// console.log(results);
	res.json({err_code:0,message:'注册成功'});
 })
})
})

// 登录页面
router.get('/login',(req,res)=>{
	res.render('./user/login.ejs',{ })
})
// 提交用户登录
router.post('/login', (req, res) => {
		if(req.body.username.length<=0||req.body.password.length<=0){
	 return res.json({err_code:1,message:'登录信息不完整'});
		}
  const sqlStr = 'select * from users2 where username=? and password=?'
  conn.query(sqlStr, [req.body.username, req.body.password], (err, results) => {
    if (err) return res.json({ err_code: 1, message: '登录失败！' })
    if (results.length !== 1) return res.json({ err_code: 1, message: '登录失败！' })
		// console.log(req.session);
  //  当用户登录成功时
    req.session.islogin = true
    // 把登录人的信息对象，也挂载到 req.session 上
		req.session.user = results[0]
		// console.log( req.session);
    res.json({ err_code: 0, message: '登录成功！' })
  })
})
// 注销登录
router.get('/logout',(req,res)=>{
	req.session.destroy(function(err){
		if(err) return res.json({err_code:1,message:'注销失败'});
		res.redirect('/');
	})	
})

// =======================================================
// 文章列表页展示
router.get('/', ctrl.showIndexPage);
router.get('/article/info', ctrl.showArticleInfoPage);
router.get('/article/edit', ctrl.showEditArticlePage);
router.post('/article/edit', ctrl.editArticle)
// 展示添加文章的页面
router.get('/article/add', ctrl.showAddArticlePage)
// 发表文章
router.post('/article/add', ctrl.addNewArticle)
module.exports = router;