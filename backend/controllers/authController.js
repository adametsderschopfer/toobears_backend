import User from "../models/user.js"
import bcrypt from "bcryptjs"
import createError from "../utils/error.js"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
    
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)


        const newUser = new User({

            username: req.body.username,
            surname: req.body.surname,
            email: req.body.email,
            role: req.body.role,
            password: hash

        })

        await newUser.save()
        res.status(201).send("Пользователь создан")

    } catch (err){
        next(err)
    }

};

export const login = async (req, res, next) => {

    try {

        const user =  await User.findOne({email: req.body.email})
        if(!user) return next(createError(404, "Пользователь не найден"))

        const role = await User.findOne({role: req.body.role})
        if(!role) return next((403, "Нет доступа") )

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCorrect) return next(createError(400, "Неправильный пароль или email"))

        const token = jwt.sign({ id:user._id, isAdmin:user.isAdmin }, process.env.JWT);


        const { password, isAdmin, ...otherDetails} = user._doc
        res.cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json({...otherDetails})
    } catch (err){
        next(err)
    }

};
