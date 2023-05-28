import CardModel from "../models/card.js"
import FeedEventModel from "../models/FeedEvent.js"
import UserSchema from '../models/User.js'

export const getAll = async (req, res) => {
    try {
        let filter = {}
        if (req.query.status) {
            filter.status = req.query.status
        }
        if (req.query.size) {
            filter.size = req.query.size
        }
        if (req.query.size_from) {
            filter.size = {}
            filter.size['$gt'] = req.query.size_from
        }
        if (req.query.size_to) {
            if (!filter.size) {
                filter.size = {}
            }
            filter.size['$lt'] = req.query.size_to
        }
        if (req.query.price_from) {
            filter.price = {}
            filter.price['$gt'] = req.query.price_from
        }
        if (req.query.price_to) {
            if (!filter.price) {
                filter.price = {}
            }
            filter.price['$lt'] = req.query.price_to
        }
        const cards = await CardModel.find(filter).populate('author').sort({
            createdAt: -1,
        }).exec();
        res.json(cards);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {

    try {

        const cardId = req.params.id
        const card = await CardModel.findByIdAndUpdate(
        {
            _id: cardId,
        },
        {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after',
        }).populate('author')
        res.json(card)
    }   catch (err) {
        res.json({message:'Что-то пошло не так'})
    }
}

export const remove = async (req, res) => {
    try {
        const cardId = req.params.id

        CardModel.findOneAndDelete({
              _id: cardId,
              author: req.userId,
            },
            (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось удалить статью'
                    })
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json({
                    success: true,
                })

            })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new CardModel({
            name: req.body.name,
            price: req.body.price,
            cathegory: req.body.cathegory,
            status: req.body.status,
            size: req.body.size,
            description: req.body.description,
            tags: req.body.tags,
            imgUrl: req.body.imgUrl,
            author: req.userId,
            currency: req.body.currency,
            symbol: req.body.symbol,
            paymentDescription: req.body.paymentDecsription,
            deliveryDescription: req.body.deliveryDecsription,
            delivery: [{
                destPrice: req.body.destPrice,
                destination: req.body.destination,
                destCurrency: req.body.destCurrency,
            }],
        })

        await UserSchema.findByIdAndUpdate(req.userId,{
            $push: {cards: doc},
        })

        const post = await doc.save()

        const event = new FeedEventModel({
            user: req.userId,
            event: 'card_create',
            type: 'card',
            entity: post._id
        })
        event.save()

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать товар'
        })
    }
}

export const update = async (req, res) => {
    try {
        const cardId = req.params.id;

        await CardModel.updateOne({
            _id: cardId,
            author: req.userId,
        }, {
            name: req.body.name,
            price: req.body.price,
            cathegory: req.body.cathegory,
            status: req.body.status,
            size: req.body.size,
            description: req.body.description,
            tags: req.body.tags,
            imgUrl: req.body.imgUrl,
            currency: req.body.currency,
            symbol: req.body.symbol,
            paymentDescription: req.body.paymentDecsription,
            deliveryDescription: req.body.deliveryDecsription,
            delivery: [{
                destPrice: req.body.destPrice,
                destination: req.body.destination,
                destCurrency: req.body.destCurrency,
            }],
        })

        if (req.body.status == 2) {
            const event = new FeedEventModel({
                user: req.userId,
                event: 'card_sold',
                type: 'card',
                entity: cardId
            })
            event.save()
        }

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить товар'
        })
    }
}

export const like = async (req, res) => {
    let card = null

    try {
        card = await CardModel.findById(req.params.id)
    } catch (err) {
        return (res.status(404).json({ ok: false }))
    }

    if (!card) {
        return (res.status(404).json({ ok: false }))
    }

    if (card.like.indexOf(req.userId) !== -1) {
        return (res.json({ ok: true }))
    }

    try {
        await CardModel.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $addToSet: { like: req.userId },
                $inc: { likeCount: 1 }
            },
            {
                new: true
            }
        )
    } catch (e) {
        console.error('like card error: card update')
        console.error(e)
        return (res.status(500).json({ error: e }))
    }

    try {
        await UserSchema.findByIdAndUpdate(
            {
                _id: req.userId,
            },
            {
                $addToSet: { liked: req.params.id }
            },
        )
    } catch (e) {
        console.error('like card error: user update')
        console.error(e)
        return (res.status(500).json({ error: e }))
    }

    const event = new FeedEventModel({
        user: req.userId,
        event: 'like',
        type: 'card',
        entity: req.params.id
    })
    event.save()

    return (res.json({ ok: true }))
}


export const likeDelete = async (req, res) => {
    let card = null

    try {
        card = await CardModel.findById(req.params.id)
    } catch (err) {
        return (res.status(404).json({ ok: false }))
    }

    if (!card) {
        return (res.status(404).json({ ok: false }))
    }

    if (card.like.indexOf(req.userId) == -1) {
        return (res.json({ ok: true }))
    }

    try {
        await CardModel.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $pull: { like: req.userId },
                $inc: { likeCount: -1 }
            },
            {
                new: true
            }
        )
    } catch (e) {
        console.error('like card error: card update')
        console.error(e)
        return (res.status(500).json({ error: e }))
    }

    try {
        await UserSchema.findByIdAndUpdate(
            {
                _id: req.userId,
            },
            {
                $pull: { liked: req.params.id }
            },
        )
    } catch (e) {
        console.error('like card error: user update')
        console.error(e)
        return (res.status(500).json({ error: e }))
    }

    FeedEventModel.findOneAndDelete({
        user: req.userId,
        event: 'like',
        entity: req.params.id,
    }).exec()

    return (res.json({ ok: true }))
}



export const getMyCards = async (req, res) => {
    try {
        let data = {
            author: req.userId,
        }
        if (req.query.status) {
            data.status = req.query.status
        }
        const cards = await CardModel.find(data).sort({
            createdAt: -1,
        }).exec();
        return (res.json(cards))
    } catch (err) {
        return (res.json(err))
    }
    // try {
    //     const user = await UserSchema.findById(req.userId)
    //     const list = await Promise.all(
    //         user.cards.map((card) => {
    //             return CardModel.findById(card._id)
    //         })
    //         )
    //     res.json(list)
    // } catch (err) {
    //     res.json({message: 'Что-то пошло не так.'})
    // }
}

export const getMyFavoriteCards = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId)
        const list = await Promise.all(
            user.liked.map((card) => {
                return CardModel.findById(card._id).populate('author')
            }),
        )
        res.json(list)
    } catch (err) {
        res.json({message: 'Что-то пошло не так.'})
    }
}

export const getUserCards = async (req, res) => {
    try {
        let user = await UserSchema.findOne({
            shortlink: req.params.id
        })

        if (!user) {
            user = await UserSchema.findById(req.params.id)
        }
        const list = await Promise.all(
            user.cards.map((card) => {
                return CardModel.findById(card._id).populate('author')
            }),
            )

        res.json(list)
    } catch (err) {
        res.json({message: 'Что-то пошло не так.'})
    }
}
