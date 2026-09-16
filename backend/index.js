import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoute.js'
import projectRouter from './routes/projectRoute.js'
import taskRouter from './routes/taskRoute.js'
import conversationRouter from './routes/conversationRoute.js'
import decisionRouter from './routes/decisionRoute.js'
import searchRoutes from './routes/searchRoute.js'
  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;



const allowedOrigin = ["http://localhost:3000"];
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.get('/',(req,res)=>{
  res.send("im root");
});

app.use('/api/user',userRouter);
app.use('/api/project',projectRouter);
app.use('/api/task',taskRouter);
app.use('/api/decision',decisionRouter);
app.use('/api/conversation',conversationRouter);
app.use('/api/search', searchRoutes);


app.use((req,res)=>{
  res.status(404).json({message : "Route not Found!"});
});

app.use((err, req, res, next) => {
    console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong'
  res.status(statusCode).json({message:message});
});

const start = async () => {
    try{
         await mongoose.connect(process.env.MONGO_URL);
         console.log("mongodb connected");
        app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));

    }catch(err){
      console.log('err occurred', err);
      process.exit(1);
    } 

}

start(); 