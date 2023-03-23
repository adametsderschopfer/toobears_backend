import  { body } from 'express-validator'

export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимальная длина пароля 6 символов').isLength({min: 6}),
];

export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимальная длина пароля 6 символов').isLength({min: 6}),
    body('username', 'Укажите имя').isLength({min: 2}),
    body('surname', 'Укажите фамилию').isLength({min: 2}),
    body('avatarUrl').optional().isURL(),
];

export const cardCreateValidation = [
    body('name', 'Введите название').isLength({min: 1}).isString(),
    body('price', 'Введите стоимость').isNumeric(),
    body('cathegory', 'Укажите категорию').isString(),
    body('status', 'Укажите статус').isString(),
    body('size', 'Укажите размер').isNumeric(),
    body('description', 'Нет описания').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тэгов').optional().isArray(),
    body('imgUrl', 'Неверное изображение').isString(),
];