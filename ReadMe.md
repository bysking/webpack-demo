1. 安装node(默认安装npm包管理工具) --> 安装vscode

2. 新建文件夹：webpack-demo
  初始化项目（package.json）：npm init -y
  安装打包工具以及webpack命令行工具： npm install webpack webpack-cli -D
  ----------------------------------------
  // 说明：--save-dev(只在开发环境安装依赖模块(package.json中devDependencies写入依赖) 或者使用命令 -D
           --save（生产环境依赖 package.json中dependencies写入依赖）
           更多帮助：https://www.cnblogs.com/limitcode/p/7906447.html
  ----------------------------------------
3. 测试零配置打包： 项目目录下新建src/index.js目录
  打开新的终端执行：npx webpack （默认找到src/index.js进行打包然后输出到dist目录（如果不存在会创建））

4. 安装webpack-dev-server: npm install webpack-dev-server --save-dev 开发者服务器，项目打包好之后是不是需要部署运行？而且他能解决本地运行跨域, 修改代码后进行热加载
5. 