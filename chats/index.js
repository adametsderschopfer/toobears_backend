import { Server } from "socket.io"

import MessageModel from "../models/Message.js"
import ChatModel from "../models/Chat.js"

import jwt from 'jsonwebtoken'

class Chats {
	constructor () {
		this.io = null
	}

	async pushHistory ({ chat, from, text, time, attachment }) {
		const doc = new MessageModel({ chat, from, text, time, attachment })
        const message = await doc.save()

		await ChatModel.updateOne({
            _id: chat
        }, {
            text: text,
        })
	}

	onConnection (socket) {
		socket.user = {}
		socket.user.id = null
		socket.user.auth = false

		socket.on('connection', (token) => {
			console.log('connected')
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

				socket.user.auth = true
				socket.user.id = decoded._id
				socket.join(decoded._id)
			} catch (e) {
				socket.emit('auth_error')
				return (false)
			}
		})

		socket.on('debug', (data) => {
			socket.user.id = data.auth.user
			socket.user.auth = true

			socket.join(data.auth.user)
		})

		socket.on('message', (data) => {
			if (!socket.user.auth) {
				return (false)
			}
			let time = (new Date()).toLocaleString('ru')
			data.time = time
			this.pushHistory(data)
			this.io.to(data.to).emit('message', {
				from: socket.user.id,
				text: data.text || null,
				attachment: data.attachment || null,
				time: time
			})

			console.log('msg from', socket.user.id, 'to', data.to)
		})
	}

	run (server) {
		console.log('chats run')
		this.io = new Server()
		this.io.attach(server)
		this.io.on('connection', this.onConnection.bind(this))
		// this.io.listen(port)
	}
}

const chats = new Chats

export { chats };
