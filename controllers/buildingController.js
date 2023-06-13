import BuildingModel from '../models/Building.js'
import { validationResult } from 'express-validator';
import StorageModel from '../models/Storage.js'
import WorkerModel from '../models/Worker.js'


import * as storageController from './storageController.js';



export const create =async (req,res)=>{
    try {
        let storageId
        try {
            const doc = new StorageModel()
            const storage =await doc.save()
            storageId = storage._id
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg:"Не удалось добавить склад!",
            })
        }
        console.log(storageId)
        const doc = new BuildingModel({
            name:req.body.buildingName,
            address:req.body.buildingAddress,
            storageId:storageId
        })
        const building =await doc.save()
        return res.json(building)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:"Не удалось добавить объект!",
        })
    }
};
export const getBuildings =async (req,res)=>{
    try {
        const building = await BuildingModel.find()
        res.json(building)
    } catch (error) {
       console.log(error)
       return res.status(500).json({
           msg:"Не удалось добавить объект!",
       })
    }
   };

export const getBuildingbyStorageId =async (req,res)=>{
    try {
        const building = await BuildingModel.find({
            storageId:{$nin:req.params.id}
        })
        res.json(building)
    } catch (error) {
       console.log(error)
       return res.status(500).json({
           msg:"Не удалось найти ид склада по объекту!",
       })
    }
   };

export const getWorkersWasByDate =async (req,res)=>{
 try {
    const building = await BuildingModel.findOne({
        _id:req.params.id,
        accounting:{$elemMatch:{date:req.body.date}}

    }).populate({path:'accounting.workers',populate:{path:'workerId',model:'Worker'}}).exec()
    if(building){
        return res.json(building)
    }
    else{
        const workers =  await WorkerModel.find({
            object_work_id:req.params.id,
            supervisor_id:req.userId
        })
        if(!workers[0]){
            return res.json({
                accounting:[{ date:"",workers: []}]
            }  
            )
        }

        let accounting ={
            date:req.body.date,
            workers:[]
        }
        workers.forEach((worker)=>{
            accounting.workers.push({
                workerId:worker._id
            })
        })
        await BuildingModel.findOneAndUpdate(
            {
                _id:req.params.id
            },
            {   
                $addToSet:{accounting:accounting},
            },
            {
                returnDocument:"after"
            }).populate({path:'accounting.workers',populate:{path:'workerId',model:'Worker'}}).exec()
            .then((doc)=>{
                if(!doc){
                    console.log(error)
                    return res.status(500).json({
                        msg:"Не удалось найти обьект!",
                    })
                }
                return res.json(doc)
            })
            .catch((error)=>{
                console.log(error)
                return res.status(500).json({
                    msg:"Не удалось добавить рабочих в список на обьекте!",
                })
            });
    }
 } catch (error) {
    console.log(error)
    return res.status(500).json({
        msg:"Не удалось добавить объект!",
    })
 }
};
// {arrayFilters:[{"elDate":req.body.date},{"elWorkerId":req.body.workerId}]}

export const updateWorkerWasByDate =async (req,res)=>{
    try {
        await BuildingModel.findOneAndUpdate(
            {
                _id:req.params.id,
                accounting:{$elemMatch:{date:req.body.date}},
            },
            {   
                $set:{"accounting.$[elem].workers.$[elem2].was":req.body.status}
            },
            {            
                arrayFilters:[{"elem.date":req.body.date},{"elem2.workerId":req.body.workerId}],
                new:true,
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
       
    } catch (error) {
       
    }
};

