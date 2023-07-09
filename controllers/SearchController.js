import CardModel from '../models/card.js'
import UserSchema from '../models/User.js'

export const search = async (req, res) => {
    if (!req.query.q) {
        return (res.json({ items: [] }))
    }

    try {
        const usersFilter = {
            $or: [
                { username: new RegExp(req.query.q, 'i') },
                { surname: new RegExp(req.query.q, 'i') },
                { shopname: new RegExp(req.query.q, 'i') },
            ],
            role: 'Seller',
        }
        const usersFields = [ 'username', 'surname', 'shopname', 'subsCount', 'avatarUrl' ]
        const users = await UserSchema.find(usersFilter, usersFields).exec()
        users.map((item, index) => {
            item._doc.type = 'user'
            return (item)
        })

        const cardsFilter = {
            name: new RegExp(req.query.q, 'i'),
            status: 1,
        }
        const cardsFields = [ 'name', 'price', 'currency', 'category', 'imgUrl', 'viewsCount', 'likeCount' ]
        const cards = await CardModel.find(cardsFilter, cardsFields).populate('author', usersFields).exec()
        cards.map((item, index) => {
            item._doc.type = 'card'
            return (item)
        })

        return (res.json({ items: [ ...users, ...cards ] }))
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}