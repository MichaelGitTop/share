const {app} = require('./connect');
const toDoList = require('./todolist/index');

app.all('*', (req, res, next) => {
  // 这里处理全局拦截，一定要写在最上面，不然会被别的接口匹配到而没有执行next导致捕捉不到
  next();
})

app.use('/toDoList', toDoList);

const port = 80;
app.listen(port, () => {
  console.log(`服务启动，端口号：${port}`)
})
