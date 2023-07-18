import {body} from "express-validator";

export const registerValidator =[
    body('password','Минимальная длина 5 символов').isLength({min:5}),
    body('name').isLength({min:4}),
    body('surname').isLength({min:4}),
    body('login').isLength({min:5}),
    body('access','Не выбраны доступы к обьектам').notEmpty().isArray(),
    body('role','Не выбраны роли').notEmpty(),
]

export const workerValidator =[
    body('fullName','ФИО не должно сожержать цифри других знаков').isString().isLength({min:9}),
    body('telephone','Минимальная длина 9 символов').isInt().isLength({min:9}),
]