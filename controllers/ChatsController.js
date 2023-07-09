import UserSchema from '../models/User.js'
import ChatModel from "../models/Chat.js"
import MessageModel from "../models/Message.js"

export const getAll = async (req, res) => {
    try {
        const chats = await ChatModel.find({ users: req.userId }).sort({ updatedAt: -1 }).populate('users').exec()
        res.json(chats)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить чаты'
        })
    }
}

export const getMessages = async (req, res) => {
    // проверяем, состоит ли юзер в этом чате
    try {
        const chats = await ChatModel.find({ _id: req.params.id, users: req.userId }).exec()
        if (!chats.length) {
            res.json({ message: 'Нет доступа к сообщениям' })
            return (false)
        }
        const messages = await MessageModel.find({ chat: req.params.id }).exec()
        res.json(messages)
    } catch (err) {
        res.json({ message: 'Что-то пошло не так' })
    }
}

export const initChat = async (from, to, text = '', attachment = null) => {
    // тут можно воткнуть проверку на роль,
    // чтобы создать чат мог только конкретный юзер
    const time = (new Date()).toLocaleString('ru')
    const users = [ from, to ]

    let chat = await ChatModel.findOne(
        { users: { $all: users } }
    )

    if (!chat) {
        const doc = new ChatModel({
            users: users,
        })
        chat = await doc.save()
    }

    if (text == '' && attachment == null) {
        return (chat)
    }

    const messageDoc = new MessageModel({
        chat: chat.id,
        from: from,
        text: text,
        time: time,
        attachment: attachment
    })
    const message = await messageDoc.save()

    return (chat)
}
