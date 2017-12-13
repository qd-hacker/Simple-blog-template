const express = require('express');
const app = express();
const session = require('express-session')
app.use(session({
	secret: 'keyboard344fdf',
	resave: false,
	saveUninitialized: false
  }))
// 配置模板引擎
// ejs 模板引擎中，默认文件的后缀名是 .ejs
app.set('view engine','ejs')
app.set('views','./views')
// 托管静态资源目录
app.use('/node_modules', express.static('./node_modules'))
// 解析表格数据
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
// 导入路由模块
const router = require('./router.js')
app.use(router)
app.listen(3000,()=>{
	console.log('http://127.0.0.1:3000');
})