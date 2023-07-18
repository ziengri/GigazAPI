import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js'
import { validationResult } from 'express-validator';
const secretToken = 'gigaz19';

export const register =async (req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array())
        }
    
        const password =req.body.password
        const salt = await bcrypt.genSalt(7)
        const passwordHash = await bcrypt.hash(password,salt)
        const doc = new UserModel({
            name:req.body.name,
            surname:req.body.surname,
            login:req.body.login,
            passwordHash:passwordHash,
            access:req.body.access,
            role:req.body.role,
        }); 
        const user = await doc.save()

        const token = jwt.sign({
            _id:user._id,
        },
        secretToken,
        {
            expiresIn:'3d'
        });

        res.json({
            ...user._doc,
            token
        })

    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Не удалось зарегестрироваться",
        })
    }
};
export const login =async (req,res)=>{
    try {
        const user = await UserModel.findOne({login:req.body.login})
        if(!user){
            return res.status(404).json({
                msg:"Пользователь не найден"
            })}
        const isValidPass = await bcrypt.compare(req.body.password,user._doc.passwordHash);
        if (!isValidPass){
            return res.status(404).json({
                msg:"Пароли не совпали"
            })
        }
        const token = jwt.sign({
            _id:user._id,
        },
        secretToken,
        {
            expiresIn:'3d'
        });
        res.json({
            ...user._doc,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Не удалось авторизоваться",
        })
    }
};
export const getMe =async (req,res)=>{
    try {
        const user = await UserModel.findById(req.userId);
        if (!user){
            return res.status(404).json({
               msg:"Пользователь не найден"
            })
        }
        const userData = user._doc
        res.json(userData)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Неn доступа",
        })
    }
    };
    export const getUsers =async (req,res)=>{
        try {
            const user = await UserModel.find().populate('access').exec();
            // console.log(user)
            if (!user){
                return res.status(404).json({
                   msg:"Пользователи не найдены"
                })
            }
            const filteredUsers = user.filter((user)=>{
                return (user.role=='Пользователь' || user.role=='Доставщик')
            })
            res.json(filteredUsers)
        } catch (error) {
            console.log(error)
            res.status(500).json({
                msg:"Неn доступа",
            })
        }
        };
        export const editUser =async (req,res)=>{
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()){
                    return res.status(400).json(errors.array())
                }
                const user = await UserModel.findOneAndUpdate(
                    {
                        _id:req.body.id
                    },
                    {   
                        name:req.body.name,
                        surname:req.body.surname,
                        access:req.body.access,
                    },
                    {
                        returnDocument:"after"
                    })
        
        
                res.json({
                    msg:'success'
                })
        
            
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    msg:"Не удалось изменить пользователя",
                })
            }
        };
        export const deleteUser =async (req,res)=>{
            try {
                const user = await UserModel.deleteOne({
                    _id:req.params.id
                })
                res.json({
                    msg:'success'
                })
        
            
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    msg:"Не удалось удалить пользователя",
                })
            }
        };