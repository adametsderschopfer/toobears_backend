import CardModel from "../models/card.js"
import UserModel from "../models/User.js";
import FeedEventModel from "../models/FeedEvent.js"

export const get = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        let filter = {}

        if (user.role == 'Seller') {
            filter = {
                $or: [
                    { 'entity': { $in: user.cards } },
                    { 'entity': req.userId },
                    { 'user': req.userId },
                ]
            }
        } else {
            filter = {
                user: req.userId,
            }
        }

        let limit = 10
        let offset = 0
        if (req.query.limit) {
            limit = parseInt(req.query.limit)
        }
        if (req.query.page) {
            offset = (parseInt(req.query.page) - 1) * limit
        }

        const events = await FeedEventModel.find(filter)
            .limit(limit)
            .skip(offset)
            .sort({
                createdAt: -1,
            }).exec();

        let users = {}
        let cards = {}

        await Promise.all(
            events.map(async (event) => {
                if (!users[event.user]) {
                    users[event.user] = await UserModel.findById(event.user)
                        .select('username surname avatarUrl shortlink')
                }
                if (event.type == 'user') {
                    if (users[event.entity]) {
                        return (true)
                    }
                    users[event.entity] = await UserModel.findById(event.entity)
                        .select('username surname avatarUrl shortlink')
                    return (true)
                }
                if (event.type == 'card') {
                    if (cards[event.entity]) {
                        return (true)
                    }
                    cards[event.entity] = await CardModel.findById(event.entity)
                        .select('name imgUrl')
                    return true
                }
            })
        )
        res.json({ users, cards, events })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить события'
        })
    }
}