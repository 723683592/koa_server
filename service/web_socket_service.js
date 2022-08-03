// 使用websocket改进项目
const path = require('path')
const WebSocket = require('ws')
const fileUtils = require('../utils/file_utils.js')
// 创建WebSocket服务端的对象，指定的端口号9998
const wss = new WebSocket.Server({
  port: 9998
})
// 服务端开起了监听
// 向外导出一个listen方法
// 用来对客户端的事件进行监听
module.exports.listen = () => {
  // client代表的是客户端的socket连接对象
  wss.on('connection', (client) => {
    console.log('有客户端连接成功了');
    client.on('message', async msg => {
      console.log('客户端发送数据给客户端了：' + msg)
      //  由服务端向客户端发送数据
      let payload = JSON.parse(msg)
      const action = payload.action
      if (action == 'getData') {
        // payload.chartName
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname, filePath)
        // 拿到对应的数据
        const res = await fileUtils.getFileJsonData(filePath)
        // 需要在服务端获取到数据的基础之上,增加一个data字段
        // data对应的值就是某个json文件的数据
        payload.data = res;
        client.send(JSON.stringify(payload))
      } else {
        // wss.clients所有客户端的连接对象
        wss.clients.forEach(client => client.send(msg))
      }
      // client.send('hello socket from backed')
    })
  })
}