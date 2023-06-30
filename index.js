import express from "express"
import multer from "multer"
import mongoose from 'mongoose'
import cors from "cors"
import { registerValidator, loginValidator, forgotValidator, cardCreateValidation } from './validation.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as CardController from './controllers/CardController.js'
import * as ChatsController from './controllers/ChatsController.js'
import * as OrderController from './controllers/OrderController.js'
import * as FeedController from './controllers/FeedController.js'
import handleValidErrors from "./utils/handleValidErrors.js"
import transporter from './mailer/index.js';
import fs from 'fs'
import http from 'http'
import https from 'https'

import { chats } from "./chats/index.js"

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('DB error', err))

// const privateKey = fs.readFileSync('utils/www.toobears.com_custom_1.key', 'utf8')
// const cert = fs.readFileSync('utils/www.toobears.com_custom_1.crtca', 'utf8')
// const credentials = {key: privateKey, cert: cert}
// const httpsServer = https.createServer(credentials, app)

const app = express();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        const patch = 'uploads/' + req.userId + '/'
        if (!fs.existsSync(patch)) {
            fs.mkdirSync(patch)
        }
        cb(null, patch)
    },
    filename: (req, files, cb) => {
        cb(null, files.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())

app.use(cors())

app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidator, handleValidErrors, UserController.register);

app.post('/auth/login', loginValidator, handleValidErrors, UserController.login)

app.post('/auth/forgot', forgotValidator, handleValidErrors, UserController.forgot)

app.get('/auth/me', checkAuth, UserController.getUser)

app.get('/users/:id', UserController.getUserById)

app.get('/users', UserController.getAllUsers)

app.patch('/auth/me', checkAuth, UserController.updateUser)

app.patch('/users/subscribe/:id', checkAuth, UserController.subscribe)
app.delete('/users/subscribe/:id', checkAuth, UserController.unsubscribe)
app.patch('/users/subscribe/:id/mail', checkAuth, UserController.subEnableMail)
app.delete('/users/subscribe/:id/mail', checkAuth, UserController.subDisableMail)

app.get('/users/me/subscribed', checkAuth, UserController.getMySubs)

app.post('/upload', checkAuth, upload.array('images', 6), (req, res) => {
    res.json({
        urls: req.files.map(function (file) {
            return `/uploads/${req.userId}/${file.originalname}`
        })

    })
})

app.post('/upload/banner', checkAuth, upload.single('banner'), (req, res) => {
    res.json({
        url: `/uploads/${req.userId}/${req.file.originalname}`
    })
})

app.post('/upload/avatar', checkAuth, upload.single('avatar'), (req, res) => {
    res.json({
        url: `/uploads/${req.userId}/${req.file.originalname}`
    })
})

app.post('/payment-handler/', (req, res) => {
    console.log('PAYMENT HANDLER')
    console.log(req.body)
})

app.get('/chats', checkAuth, ChatsController.getAll)
app.get('/chats/:id', checkAuth, ChatsController.getMessages)
app.post('/chats', checkAuth, async (req, res) => {
    res.json(await ChatsController.initChat(req.userId, req.body.user, req.body.text, req.body.attachment))
})

app.get('/market', CardController.getAll)
app.get('/market/:id', CardController.getOne)
app.post('/market', checkAuth, handleValidErrors, cardCreateValidation, CardController.create)
app.delete('/market/:id', checkAuth, CardController.remove)
app.patch('/market/:id', checkAuth, handleValidErrors, CardController.update)
app.get('/market/user/me', checkAuth, CardController.getMyCards)
app.patch('/market/:id/like', checkAuth, CardController.like,)
app.delete('/market/:id/like', checkAuth, CardController.likeDelete,)
app.delete('/market/:id/likeremove', checkAuth, CardController.likeDelete,) // deprecated
app.get('/market/user/me/liked', checkAuth, CardController.getMyFavoriteCards)
app.get('/market/cards/:id', CardController.getUserCards)

app.get('/orders', checkAuth, OrderController.get)
app.get('/orders/:id', checkAuth, OrderController.getItem)
app.post('/orders', checkAuth, OrderController.create)
app.patch('/orders/:id', checkAuth, OrderController.update)
app.patch('/orders/:id/delivery', checkAuth, OrderController.updateDelivery)
app.delete('/orders/:id', checkAuth, OrderController.remove)

app.get('/feed', checkAuth, FeedController.get)

const server = http.createServer(app)
console.log('Server is running')

chats.run(server)

// app.listen(4444, (err) =>{
//     if (err) {
//         return console.log(err)
//     }

//     console.log('Server is running')
// });

server.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('runned 4444')
})
