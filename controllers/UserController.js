import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

import fetch, { FormData } from 'node-fetch'

import UserModel from "../models/User.js";
import SubscriberModel from "../models/Subscriber.js"
import FeedEventModel from "../models/FeedEvent.js"

import { notifyForgotPassword } from '../mailer/user.js';

async function checkCaptcha (response) {
    const url = "https://www.google.com/recaptcha/api/siteverify"
    const formData = new FormData()
    formData.set('secret', process.env.CAPTCHA_SECRET_KEY)
    formData.set('response', response)
    const raw = await fetch(url, {
        method: 'POST',
        body: formData
    })
    const resp = await raw.json()
    return (resp.success || false)
}

export const register = async (req, res) => {
    try {
    	if (req.body.role == 'Seller') {
    		if (req.body.code !== process.env.SELLER_INVITE_CODE) {
    			return (res.status(500).json({
	                message: "Неверный код приглашения",
	            }))
    		}
    	}

        if (!await checkCaptcha(req.body['g-recaptcha-response'])) {
            return (res.status(500).json({
                message: 'Ошибка прохождения капчи'
            }))
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            role: req.body.role,
            username: req.body.username,
            surname: req.body.surname,
            email: req.body.email.toLowerCase(),
            passwordHash: hash,
            delivery: [{ destPrice: [], destination: [], destCurrency: [] }],
        })

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, process.env.JWT_SECRET_KEY,
            {
                expiresIn: '24h'
            },)

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token,
        })

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).json({ message: 'User with this email already exists' });
        } else {
            res.status(500).json({
                message: "Не удалось зарегистрироваться",
            })
        }
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email.toLowerCase() })

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secretkey',
            {
                expiresIn: '24h'
            })

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token,
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Не удалось авторизоваться",
        })
    }
};

function generatePassword(length = 10) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resp = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
        resp += charset.charAt(Math.floor(Math.random() * n));
    }
    return resp;
}

export const forgot = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return (res.status(500).json({
                message: "Не удалось отправить запрос на сброс пароля",
            }))
        }

        const password = generatePassword(10);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await user.updateOne({
            passwordHash: hash
        })

        notifyForgotPassword(user, password)

        res.json({
            ok: true
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Не удалось отправить запрос на сброс пароля",
        })
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc


        res.json(userData)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
};

export const getUserById = async (req, res) => {
    try {
        let user = await UserModel.findOne({
            shortlink: req.params.id
        })

        if (!user) {
            user = await UserModel.findById(req.params.id)
        }

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc


        res.json(userData)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().populate('cards').sort({
            createdAt: -1,
        }).exec();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить пользователей'
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        await UserModel.updateOne({
            _id: user
        }, {
            shopname: req.body.shopname,
            bannerUrl: req.body.bannerUrl,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            description: req.body.description,
            username: req.body.username,
            surname: req.body.surname,
            country: req.body.country,
            fbUrl: req.body.fbUrl,
            tgUrl: req.body.tgUrl,
            instUrl: req.body.instUrl,
            vkUrl: req.body.vkUrl,
            paymentDescription: req.body.paymentDescription,
            deliveryDescription: req.body.deliveryDescription,
            delivery: [{
                destPrice: req.body.destPrice,
                destination: req.body.destination,
                destCurrency: req.body.destCurrency,
            }],
        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err
        })
    }
}

export const updateShortlink = async (req, res) => {
    try {
        const isBusy = await UserModel.findOne({ 
            shortlink: req.body.shortlink
        })
        if (isBusy) {
            return res.status(500).json({
                message: 'Короткая ссылка занята',
                u: isBusy
            })
        }

        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        await UserModel.updateOne({
            _id: user
        }, {
            shortlink: req.body.shortlink
        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: err
        })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.oldPassword, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный пароль',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.newPassword, salt);

        await user.updateOne({
            passwordHash: hash
        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err
        })
    }
}


export const subscribe = async (req, res) => {
    try {
        const subscriber = await SubscriberModel
            .findOne({ speaker: req.params.id, listener: req.userId })
        
        if (subscriber) {
            return (res.json({ ok: true }))
        }

        const doc = new SubscriberModel({
            speaker: req.params.id,
            listener: req.userId,
        })
        await doc.save();

        await UserModel.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $inc: { subsCount: 1 }
            }
        )

        const event = new FeedEventModel({
            user: req.userId,
            event: 'subscribe',
            type: 'user',
            entity: req.params.id
        })
        event.save()

        res.json({ ok: true })
    } catch (err) {
        return res.json(err)
    }
}

export const unsubscribe = async (req, res) => {
    try {
        const subscriber = await SubscriberModel
            .findOne({ speaker: req.params.id, listener: req.userId })
        
        if (!subscriber) {
            return (res.json({ ok: true }))
        }

        await subscriber.delete()

        await UserModel.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $inc: { subsCount: -1 }
            }
        )

        FeedEventModel.findOneAndDelete({
            user: req.userId,
            event: 'subscribe',
            entity: req.params.id,
        }).exec()

        res.json({ ok: true })
    } catch (err) {
        return res.json(err)

    }
}

export const subEnableMail = async (req, res) => {
    try {
        await SubscriberModel.updateOne(
            {
                speaker: req.params.id,
                listener: req.userId
            },
            {
                enableEmail: true
            }
        )

        res.json({ ok: true })
    } catch (err) {
        return res.json(err)
    }
}

export const subDisableMail = async (req, res) => {
    try {
        await SubscriberModel.updateOne(
            {
                speaker: req.params.id,
                listener: req.userId
            },
            {
                enableEmail: false
            }
        )

        res.json({ ok: true })
    } catch (err) {
        return res.json(err)

    }
}

export const getMySubs = async (req, res) => {
    try {
        const speakers = await SubscriberModel.find({ listener: req.userId })

        let list = await Promise.all(
            speakers.map((sub) => {
                return (UserModel.findById(sub.speaker).populate('cards'))
            }),
        )

        list.map((item, index) => {
            if (!item) {
                return (null)
            }
            item._doc.enableEmail = speakers[index].enableEmail
            return (item)
        })

        list = list.filter(v => v)

        res.json(list)
    } catch (err) {
        console.error(err)
        res.json({ error: 500 })
    }
}
