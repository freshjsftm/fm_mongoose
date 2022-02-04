const http = require('http');
const express = require('express');
const yup = require('yup');
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose
.connect('mongodb://localhost:27017/fm_mongoose')
.catch(error => console.log(error));

const taskSchema = new Schema({
  description:String,
  isDone:Boolean,
  dateAt:{ type: Date, default: Date.now },
  author:{
    name:String,
    age:Number
  }
})
const Task = mongoose.model('Task', taskSchema);


const app = express();
app.use(express.json());
app.post('/', async (req, res, next)=>{
  try {
    const {body} = req;
    const newTask = await Task.create(body);
    res.send(newTask)
  } catch (error) {
    next(error)
  }
});
app.get('/', async (req, res, next)=>{
  try {
    const tasks = await Task.find();
    res.send(tasks)
  } catch (error) {
    
  }
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{console.log('Server started!')});