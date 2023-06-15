import UserModel from '../models/User.js'
import CardModel from '../models/card.js'
import OrderModel from "../models/Order.js"
import FeedEventModel from "../models/FeedEvent.js"

import * as ChatsController from './ChatsController.js'
import Chat from '../models/Chat.js'
import Message from '../models/Message.js'

export const get = async (req, res) => {
    try {
        const orders = await OrderModel.find({
            $or: [
                { buyer: req.userId },
                { seller: req.userId }
            ],
            status: req.query.status || { $in: [ 0, 1, 2, 3 ] }
        }).populate('card').sort({
            createdAt: -1,
        }).exec()
        res.json(orders)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить заказы'
        })
    }
}

export const getItem = async (req, res) => {
  try {
    const orders = await OrderModel.find({
        _id: req.params.id,
        $or: [
            { buyer: req.userId },
            { seller: req.userId }
        ],
        status: req.query.status || { $in: [ 0, 1, 2, 3 ] }
    })
    .populate('buyer', '-passwordHash')
    .populate('seller', '-passwordHash')
    .populate('card')
    .sort({
        createdAt: -1,
    }).exec()
    res.json(orders)
  } catch (error) {
    console.log(err);
        res.status(500).json({
            message: 'Не удалось получить заказы'
        })
  }
}

export const remove = async (req, res) => {
    try {
        OrderModel.findOneAndDelete({
              _id: req.params.id,
            },
            (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось удалить заказ'
                    })
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Заказ не найден'
                    })
                }

                res.json({
                    success: true,
                })

            })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить заказы'
        })
    }
}

export const create = async (req, res) => {
    try {
        const card = await CardModel.findOne({ _id: req.body.card }).exec()
        let chat = await Chat.findOne({
            users: {
                $all: [req.userId, card.author]
            }
        }).exec()

        if(!chat) {
            chat = new Chat({
                users: [req.userId, card.author],
            })
        }

        const message = new Message({
            chat: chat._id,
            user: req.userId,
            text: req.body.text || '',
        })

        chat.lastMessage = message._id

        await message.save()
        await chat.save()

        const doc = new OrderModel({
            card: req.body.card,
            buyer: req.userId,
            seller: card.author,
            shippingName: req.body.shippingName,
            shippingCountry: req.body.shippingCountry,
            shippingCity: req.body.shippingCity,
            shippingState: req.body.shippingState,
            shippingAddress: req.body.shippingAddress,
            shippingPortalCode: req.body.shippingPortalCode,
            shippingPhone: req.body.shippingPhone,
            message: req.body.message,
        })

        const post = await doc.save()

        const event = new FeedEventModel({
            user: req.userId,
            event: 'order_create',
            type: 'card',
            entity: req.body.card
        })
        event.save()

        await ChatsController.initChat(req.userId, card.author, req.body.text || '', req.body.attachment || null)

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать заказ'
        })
    }
}

export const updateDelivery = async (req, res) => {
    try {
        await OrderModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                deliveryCode: req.body.code || '',
            }
        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить заказ'
        })
    }
}

export const update = async (req, res) => {
    try {
        await OrderModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                status: Number(req.body.status),
            }
        });

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить заказ'
        })
    }
}

