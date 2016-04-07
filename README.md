#常见问题

###1.git无法正常推送
- 错误现象：
	> error: RPC failed; result=22, HTTP code = 411
- 错误提示：
> fatal: The remote end hung up unexpectedly
- 解决方案：
> $ git config --global http.postBuffer 52428800

BAE Git 仓库默认只需要上传最大的文件为1MB，通过修改postBuffer来修改上传文件的最大值，这里我们设置为524288000，即最大可以上传500MB的文件。

###2.环境切换
1. 切换到生产环境：
	>$ export NODE_ENV=production
2. 切换到开发环境：
	>$ export NODE_ENV=development
3. 验证环境：	
	>$ node bin/test.js 

###3.mongodb

###### cjf 备忘

- 终端切换至`mongodb`目录
- 执行 `./mongod --dbpath ../data/db`
- 打开机器人,即可看到连接的数据库


#PC 页面图片size

###首页

- 广告图(大图)：1400px*580px
- 广告图(小图)：155px*95px

###产品列表页

- 广告图（大图）：1400px*580px
- 产品：320px*320px

###产品详情页

- 产品（大图）：400px*400px
- 产品（小图）：65px*65px
- 产品属性选择图：45px*3px
- 商品详情图:宽度740px，高度不限

###品牌介绍、联系我们

- 内页图：宽度685px，高度不限

###登录页

- 左侧广告图：宽度小于 498px，高度小于 398px 都可以垂直居中显示

###富文本输入框UEditor
- /offline/content/edit 新增地址
- /offline/content/edit/aaa 修改地址

###命令 
- 可以查看该端口被什么程序占用，并显示PID，方便KILL
    > lsof -i tcp:port  （port替换成端口号，比如6379）
    > kill [pid]  （杀掉进程）

###改进配置调试机制
- 在命令行中直接输入：
    > node bin/debug.js
- 或者
    > supervisor bin/debug.js
- 即可进行调试，不要修改 models/index.js文件
# tosit
