import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import WorkerModel from '../models/Worker.js'
import BuildingModel from '../models/Building.js'

import { validationResult } from 'express-validator';

export const create =async (req,res)=>{
    try {
        const validError = validationResult(req);
        if (!validError.isEmpty()){
            return res.status(400).json(validError.array())
        }
        const doc = new WorkerModel({
            fullName:req.body.fullName,
            telephone:req.body.telephone,
            specialization:req.body.specialization,
            supervisor_id:req.userId,
            object_work_id:req.body.object_work_id
        })
        const worker=await doc.save()
        res.json(worker)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Не удалось добавить рабочего!",
        })
    }
};
export const getWorkerByUser =async (req,res)=>{
    try {
        const worker = await WorkerModel.find({supervisor_id:req.userId}).populate(['supervisor_id','object_work_id']).exec()
        if(!worker){
            return res.status(404).json({
                msg:"Рабочие не найдены"
            })
        }
        const building = await BuildingModel.findOne({
            name:worker[0].object_work_id.name
        })

        // console.log(building.accounting).split('-')[1]
        let workers =[]
        worker.map((el)=>{
            // console.log(el)
            let salary = 0
            const todayMount = new Date().getMonth()+1
            building.accounting.map((el2,index)=>{
                const mount = new Date(el2.date).getMonth()+1
                if (todayMount==mount){
                    // console.log(el2.)
                    el2.workers.map((el3,index)=>{
                        if((el3.workerId.toString()==el._id.toString())&&el3.was==true){
                            console.log(true)
                            salary+=1
                        }
                    })
                }

            })
          workers.push({
            id:el._id,
            fullName:el.fullName,
            telephone:el.telephone,
            supervisor_name:`${el.supervisor_id.name} ${el.supervisor_id.surname}`,
            object_work_name:el.object_work_id.name,
            specialization:el.specialization,
            salary:`${(salary*1200)}руб`,
            delid:el._id,
            editid:el._id
          })
        })
        return res.json(workers)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Не удалось получить рабочих",
        })
    }
};
export const deleteById =async (req,res)=>{
    try {
        const user = await WorkerModel.deleteOne({_id:req.params.id})
        if (!user){
            return res.status(404).json({
               msg:"Пользователь не найден"
            })
        }
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Неn доступа",
        })
    }
    };
    
    export const getWorkerById =async (req,res)=>{
        try {
            const user = await WorkerModel.findOne({_id:req.params.id})
            if (!user){
                return res.status(404).json({
                   msg:"Пользователь не найден"
                })
            }
            res.json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json({
                msg:"Нет доступа",
            })
        }
        };
        export const editWorkerById =async (req,res)=>{
            try {
                const user = await WorkerModel.findOneAndUpdate(
                    {_id:req.body.id},
                    {
                        fullName:req.body.fullName,
                        specialization:req.body.specialization,
                        object_work_id:req.body.object_work_id,
                    },
                    {
                        returnDocument:"after"
                    }
                    
                )
                if (!user){
                    return res.status(404).json({
                       msg:"Пользователь не найден"
                    })
                }
                res.json(user)
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    msg:"Нет доступа",
                })
            }
            };
            // export const getAllWorker =async (req,res)=>{
            //     try {
            //         const user = await WorkerModel.find()
            //         if (!user){
            //             return res.status(404).json({
            //                msg:"Пользователь не найден"
            //             })
            //         }
            //         res.json(user)
            //     } catch (error) {
            //         console.log(error)
            //         res.status(500).json({
            //             msg:"Нет доступа",
            //         })
            //     }
            //     };
            export const getAllWorker =async (req,res)=>{
                try {
                    const worker = await WorkerModel.find().populate(['supervisor_id','object_work_id']).exec()
                    if(!worker){
                        return res.status(404).json({
                            msg:"Рабочие не найдены"
                        })
                    }
                    const building = await BuildingModel.findOne({
                        name:worker[0].object_work_id.name
                    })
            
                    // console.log(building.accounting).split('-')[1]
                    let workers =[]
                    worker.map((el)=>{
                        // console.log(el)
                        let salary = 0
                        const todayMount = new Date().getMonth()+1
                        building.accounting.map((el2,index)=>{
                            const mount = new Date(el2.date).getMonth()+1
                            if (todayMount==mount){
                                // console.log(el2.)
                                el2.workers.map((el3,index)=>{
                                    if((el3.workerId.toString()==el._id.toString())&&el3.was==true){
                                        console.log(true)
                                        salary+=1
                                    }
                                })
                            }
            
                        })
                      workers.push({
                        id:el._id,
                        fullName:el.fullName,
                        telephone:el.telephone,
                        supervisor_name:`${el.supervisor_id.name} ${el.supervisor_id.surname}`,
                        object_work_name:el.object_work_id.name,
                        specialization:el.specialization,
                        salary:`${(salary*1200)}руб`,
                        delid:el._id,
                        editid:el._id
                      })
                    })
                    return res.json(workers)
                } catch (error) {
                    console.log(error)
                    res.status(500).json({
                        msg:"Не удалось получить рабочих",
                    })
                }
            };