import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import StorageModel from '../models/Storage.js'
import { validationResult } from 'express-validator';

export const create =async (req,res)=>{
    try {
        const doc = new StorageModel()
        const storage =await doc.save()
        return res.json(storage)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:"Не удалось добавить склад!",
        })
    }
};
export const addProductById =async (req,res)=>{
    try {
        let product ={
            name:req.body.name,
            count:req.body.count
        }
        const check = await StorageModel.findOne({
            _id:req.params.id
        })
        const productArray = check.products
        const UniqueProductName = obj => obj.name === req.body.name;
        if (productArray.some(UniqueProductName)){
            return res.status(500).json({
                msg:"Такой продукт уже есть"
            })
        }
        await StorageModel.findOneAndUpdate(
            {
                _id:req.params.id
            },
            {   
                $addToSet:{products:product},
            },
            {
                returnDocument:"after"
            })
            .then((doc)=>{
                if(!doc){
                    console.log(error)
                    return res.status(500).json({
                        msg:"Не удалось найти склад!",
                    })
                }
                return res.json(doc)
            })
            .catch((error)=>{
                console.log(error)
                return res.status(500).json({
                    msg:"Не удалось добавить продукт в базу!",
                })
            });
        
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Не удалось добавить продукт!",
        })
    }
};
export const updateStorageById =async (req,res)=>{
    try {
        let product ={
            name:req.body.name,
            count:req.body.count
        }
        await StorageModel.findOneAndUpdate(
            {
                _id:req.params.id,
                products:{$elemMatch:{name:product.name}}
            },
            {   
                $set:{"products.$.count":product.count,
            }
            },
            {
                returnDocument:"after"
            })
            .then((doc)=>{
                if(!doc){
                    console.log(error)
                    return res.status(500).json({
                        msg:"Не удалось найти элемент в складе!",
                    })
                }
                return res.json(doc)
            })
            .catch((error)=>{
                console.log(error)
                return res.status(500).json({
                    msg:"Не удалось обновить эелемент в базе!",
                })
            });
        
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Не удалось обновить эелемент!",
        })
    }
};
export const deleteStorageById =async (req,res)=>{
    try {
        console.log(req.params.id,req.body)
        const storage = await StorageModel.findOne({
            _id:req.params.id,
            products:{$elemMatch:{name:req.body.name}}
        })
        if(!storage){return res.status(500).json({msg:"Ошибка при проверки на досупость склада"})}
        storage.products.map((el,index)=>{
            if(el.name==req.body.name){
                storage.products.splice(index,1)
            }
        })
        const storageSaved = await storage.save()
        return res.json(storageSaved)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
        
    }
};
export const getStorageById =async (req,res)=>{
    try {
        const storage = await StorageModel.findById(req.params.id);
        if(!storage){
            console.log(storage)
            return res.status(500).json({
                msg:"Не удалось найти склад"
            })
        }
        return res.json(storage)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Не удалось информации о складе",
        })
    }
    };

