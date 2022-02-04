const http = require('http');
const express = require('express');
const yup = require('yup');
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose
.connect('mongodb://localhost:27017/fm_mongoose')
.catch(error => console.log(error));



const taskSchema = new Schema({
  description:{ 
    type: String,
    required:[true, 'must be'],
    validate:{
      validator: (v)=>/[A-Z][a-z\s!]{5,200}/.test(v),
      message: '{VALUE} must be letter!'
    },
  },
  isDone:{ type: Boolean, default:false },
  dateAt:{ type: Date, default: Date.now },
  author:{
    name:{ 
      type: String,
      required:true
    },
    email:{ 
      type: String,
      required:true
    },
    age:{
      type: Number,
      validate:{
        validator: (v)=>v>0
      }
    }
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