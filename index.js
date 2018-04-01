var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var name

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
ws.send(JSON.stringify({
		name : "From Server",
		data : "Connected!!! Enjoy!!"
	}))
	ws.on('message', function (message) {
		console.log(message);
		message = JSON.parse(message)

		if (message.type == "key") {
			ws.authKey = message.data
			ws.clientName = message.name
			return
		}

		wss.clients.forEach(function (client) {
				if (client != ws) {
					client.send(JSON.stringify({
						name : ws.clientName,
						data : message.data
					}))
				}
		
		})
	})
})
