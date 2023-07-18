import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {registerValidator,workerValidator} from './validations/Validations.js';
import checkAuth from "./utils/checkAuth.js";
import * as UserController from './controllers/userController.js'
import * as WorkerController from './controllers/workerController.js'
import * as StorageController from './controllers/storageController.js'
import * as BuildingController from './controllers/buildingController.js'
import * as DeliveryController from './controllers/deliveryController.js'
import checkAdmin from './utils/checkAdmin.js';





// mongoose.connect('mongodb://127.0.0.1:27017/test')
mongoose.connect('mongodb://127.0.0.1:27017/GigazDB')
    .then(()=> console.log("DB Connected"))
    .catch((err)=>console.log("DB Errorr",err))
const secretToken = 'gigaz19';
const PORT = 3000;  
const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT,(err)=>{
    err?console.log(err):console.log(`Started on ${PORT}`)
})


app.get('/auth/me',checkAuth,UserController.getMe);
app.post('/auth/reg',registerValidator,UserController.register);
app.post('/auth/login',UserController.login);
app.get('/api/user',checkAuth,checkAdmin,UserController.getUsers);
app.patch('/api/user',checkAuth,checkAdmin,UserController.editUser);
app.delete('/api/user/:id',checkAuth,checkAdmin,UserController.deleteUser);

app.post('/api/worker',checkAuth,workerValidator,WorkerController.create);
app.get('/api/worker',checkAuth,workerValidator,WorkerController.getWorkerByUser);
app.get('/api/worker/all',checkAuth,workerValidator,WorkerController.getAllWorker);
app.get('/api/worker/:id',checkAuth,WorkerController.getWorkerById);
app.delete('/api/worker/:id',checkAuth,WorkerController.deleteById);
app.patch('/api/worker/',checkAuth,WorkerController.editWorkerById);


app.post('/api/storage',checkAuth,StorageController.create);
app.put('/api/storage/:id',checkAuth,StorageController.addProductById);
app.patch('/api/storage/:id',checkAuth,StorageController.updateStorageById);
app.get('/api/storage/:id',checkAuth,StorageController.getStorageById);
app.post('/api/storage/delete-item/:id',StorageController.deleteStorageById);

app.get('/api/building',checkAuth,BuildingController.getBuildings);
app.post('/api/building',checkAuth,checkAuth,BuildingController.create);
app.post('/api/building/:id',checkAuth,BuildingController.getWorkersWasByDate);
app.patch('/api/building/:id',checkAuth,BuildingController.updateWorkerWasByDate);
app.get('/api/building/storage/:id',checkAuth,BuildingController.getBuildingbyStorageId);
app.delete('/api/building/:id',checkAuth,BuildingController.deleteBuilding);


app.post('/api/delivery',checkAuth,DeliveryController.create);
app.get('/api/delivery/:id',checkAuth,DeliveryController.getDeliveryByObject);
app.get('/api/delivery',checkAuth,DeliveryController.getDeliveryAll);
app.patch('/api/delivery/start/:id',checkAuth,DeliveryController.startDelivery);
app.patch('/api/delivery/finish/:id',checkAuth,DeliveryController.finishDelivery);






// app.get('/api/worker:id',WorkerController.getOne);
// app.get('/api/worker',WorkerController.getAll);
// app.patch('/api/worker',WorkerController.update);
// app.delete('/api/worker',WorkerController.remove);



