import { configDotenv } from 'dotenv';
import cors from 'cors'
import morgan from 'morgan';
import express from 'express';
import db from './database.js';
import router from './routes/index.js';
configDotenv();

const app=express();

app.use(cors({
    origin:process.env.FRONTEND,
    methods:['GET','PUT','POST','PATCH','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}));
app.use(express.json());
app.use(morgan("dev"));

//main routes
app.use('/api/v1',router);

const port=process.env.PORT;
app.listen(port,()=>{
    console.log("Server started ",port)
    db();
})  