const conn = require('./model.js')
const moment = require('moment')
// 导入 mditor
const mditor = require('mditor')
const parser = new mditor.Parser();
function showIndexPage(req,res){
    let list =[];
	const nowPage = parseInt(req.query.page) || 1;
	const pageSize = 2;
	const sqlStr = `select articles.*,users2.nickname
	from articles LEFT JOIN users2
	ON articles.authorId=users2.id
	order by id desc
	LIMIT ${(nowPage-1)*pageSize},${pageSize};
	select count(*) as totalcount from articles;`
	 conn.query(sqlStr,(err,results)=>{
	 list = results[0];
	//  console.log(results)
	//  console.log(list);
	 const totalcount = results[1][0].totalcount;
	 res.render('index',{
		 	// 给session挂载两个自定义属性，是否登录 用户信息
			 islogin:req.session.islogin,
			 user:req.session.user,
			 list:list,
			 totalPage:Math.ceil(totalcount / pageSize),
			 nowPage:nowPage
    })
})
}   
var showArticleInfoPage =(req,res)=>{
    const id = req.query.id;
    let showArticleInfoPage={}
    const sqlStr = 'select * from articles where id=?'
    conn.query(sqlStr,id,(err,results)=>{
        if (results.length === 1) articleInfo = results[0];
        articleInfo.content = parser.parse(articleInfo.content || '')
        res.render('./article/info.ejs', {
            islogin: req.session.islogin,
            user: req.session.user,
            article: articleInfo
          })
    })
}
var showEditArticlePage = (req,res) =>{
   if(!req.session.islogin) return res.redirect('/login');
   const id = req.query.id;
   const sqlStr = 'select * from articles where id=?'
   conn.query(sqlStr,id,(err,results)=>{
       if(err) return res.json({err_code:1,message:'查询失败11'});
       if(results.length !== 1) return res.json({ err_code: 1, message: '查询失败1444！' })
    //    if (results[0].authorId != req.session.user.id) return res.redirect('/');
        res.render('./article/edit.ejs',{
        islogin:req.session.islogin,
        user:req.session.user,
        article:results[0]
       })
   })
}

var editArticle = (req, res) => {
    const article = req.body;
    const sqlStr = 'update articles set ? where id=?'
    conn.query(sqlStr,[article, article.id],(err,results)=>{
        if (err || results.affectedRows !== 1) return res.json({ err_code: 1, message: '更新文章失败！' })
        res.json({ err_code: 0, message: '更新文章成功！' })
    })
}
var showAddArticlePage = (req, res) => {
    if (!req.session.islogin) return res.redirect('/login')
    res.render('./article/add.ejs',{
        islogin: req.session.islogin,
        user: req.session.user 
    })
}
var addNewArticle=(req,res)=>{
    const article = req.body
    article.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    const sqlStr='insert into articles set ?'
    conn.query(sqlStr, article, (err, results) => {
        if (err || results.affectedRows !== 1) return res.json({ err_code: 1, message: '发表文章失败！' })
        res.json({ err_code: 0, message: '发表文章成功，可以跳转到文章详情页面去查看！', id: results.insertId })
    })
}
module.exports={
    showIndexPage,
    showArticleInfoPage,
    showEditArticlePage,
    editArticle,
    showAddArticlePage,
    addNewArticle
}