import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app=express();
app.use(express.json());
app.get('',(req,res)=>{
    res.status(200).send('<h3>server is running</h3>');
})
const server = app.listen(process.env.port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${process.env.port}`),
)