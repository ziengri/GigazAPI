import BuildingModel from '../models/Building.js'
import { validationResult } from 'express-validator';
import DeliveryModel from '../models/Delivery.js'
import StorageModel from '../models/Storage.js'



// import * as storageController from './storageController.js';



export const create =async (req,res)=>{
    try {
        try {
            console.log(req.body)
            const to = await StorageModel.findOne({
                _id:req.body.to
            })
            if(!to){
                return res.status(500).json({
                    msg:"Склад отправки не найден"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg:"ОШибка при проверки на досупость склада прибытия"
            })
        }
        try {
            const from = await StorageModel.findOne({
                _id:req.body.from,
                products:{$elemMatch:{name:req.body.name}}
            })
            if(!from){return res.status(500).json({msg:"ОШибка при проверки на досупость склада отправки"})}
            from.products.map((el,index)=>{
                if(el.name==req.body.name){
                    if((el.count-req.body.count)>0){
                        el.count-=req.body.count
                    }
                    else{
                        from.products.splice(index,1)
                    }
                }
            })
            const fromSaved = await from.save()
        } catch (error) {
            return res.status(500).json(error)
            
        }
        const doc = new DeliveryModel({
            name:req.body.name,
            count:req.body.count,
            from:req.body.from,
            to:req.body.to,
        })
        const delivery =await doc.save()
        return res.json({
            msg:'success',
            res:delivery
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:"Не удалось создать запрос на доставку",
        })
    }
};
export const getDeliveryByObject =async (req,res)=>{
    try {
        const delivery = await DeliveryModel.find({
            $or:[
                {from:req.params.id},
                {to:req.params.id}
            ]
        })
        if(!delivery){
            return res.status(500).json({
                msg:"Не удалось получить доставки по id!",
            })
        }
        const building = await BuildingModel.find()
        if(!building){return res.status(500).json({msg:"Не удалось найти обьекты"})}

        console.log(building)

        let sortDelivery = []
        delivery.map(async (item,index)=>{
            let from = building.find(obj => {
                return obj.storageId.toString() === item.from.toString()
              })
            let to = building.find(obj => {
                return obj.storageId.toString() === item.to.toString()
              })
            sortDelivery.push({
                id:item._id,
                name:item.name,
                count:item.count,
                from:from.name,
                to:to.name,
                toId:item.to,
                status:item.status,
                deleveryMan:item.deleveryMan,
            })
        })
        // console.log(sortDelivery)
        res.json(sortDelivery)
    } catch (error) {
       console.log(error)
       return res.status(500).json({
           msg:"Не удалось получить доставки по id!",
       })
    }
   };
   export const getDeliveryAll =async (req,res)=>{
    try {
        const delivery = await DeliveryModel.find()
        if(!delivery){return res.status(500).json({msg:"Не удалось найти доставки"})}
        const building = await BuildingModel.find().select({accounting:0,address:0,__v:0})
        if(!building){return res.status(500).json({msg:"Не удалось найти обьекты"})}

        let sortDelivery =[]
        delivery.map(async (item,index)=>{
            let from = building.find(obj => {
                return obj.storageId.toString() === item.from.toString()
              })
            let to = building.find(obj => {
                return obj.storageId.toString() === item.to.toString()
              })
            sortDelivery.push({
                id:item._id,
                name:item.name,
                count:item.count,
                from:from.name,
                to:to.name,
                toId:item.to,
                status:item.status,
                deleveryMan:item.deleveryMan,
            })
        })
        res.json(sortDelivery)
    } catch (error) {
       console.log(error)
       return res.status(500).json({
           msg:"Не удалось получить все доставки!",
       })
    }
   };
   export const startDelivery =async (req,res)=>{
    try {
        const userId = req.userId
        const delivery = await DeliveryModel.findOneAndUpdate({
            _id:req.params.id
        },
        {
            deleveryMan:userId,
            status:"Ожидает прибытия"
        },
        {
            returnDocument:"after"
        })
        res.json(delivery)
        // res.json({
        //     msg:'success'
        // })
    } catch (error) {
       console.log(error)
       return res.status(500).json({
           msg:"Не удалось начать доставку!",
       })
    }
   };
   export const finishDelivery =async (req,res)=>{
    try {
        const delivery = await DeliveryModel.findOne({_id:req.params.id})
        if(!delivery){return res.status(500).json({msg:"Не удалось найти заявки"})}
        const storage = await StorageModel.findOne({_id:delivery.to})
        if(!storage){return res.status(500).json({msg:"Не удалось найти склад доставки"})}


        const result = storage.products.find((obj,index) => {
            if(obj.name === delivery.name){
                console.log("Нашлось")
                storage.products[index].count+=delivery.count
                return delivery.status='Доставленно'
            }
            // console.log(index,' ',obj)
            // return obj.name === delivery.name
          })
        console.log(typeof result)
        console.log(result)
        if(!result){
            const product={
                name:delivery.name,
                count:delivery.count
            }
            storage.products.push(product)
            delivery.status='Доставленно'
        }

        // storage.products.map(((item,index)=>{
        //     if(item.name==delivery.name){
        //         console.log("Нашлось")
        //         storage.products[index].count+=delivery.count
        //         return delivery.status='Доставленно'
        //     }
        // }))
        delivery.save()
        storage.save()
        res.json({msg:"success"})
    } catch (error) {
       console.log(error)
       return res.status(500).json({
           msg:"Не удалось закончить доставку!",
       })
    }
   };