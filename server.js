const http = require('http');
const express = require('express');
const yup = require('yup');
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose
.connect('mongodb://localhost:27017/fm_mongoose')
.catch(error => console.log(error));

const emailSchema = yup.string().email().required()

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
      required:true,
      validate:{
        validator: (v)=>emailSchema.isValid(v)
      }
    },
    age:{
      type: Number,
      validate:{
        validator: (v)=>v>0
      }
    }
  }
},{
  versionKey:false,
  timestamps:true
})
const commentSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  task: {type: Schema.Types.ObjectId, ref:'Task'}
},
{
  versionKey:false,
  timestamps:true
})

const Task = mongoose.model('Task', taskSchema);
const Comment = mongoose.model('Comment', commentSchema);

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
    next(error)
  }
});
app.patch('/:taskId', async(req, res, next)=>{
  try {
    const {body, params:{taskId}} = req;
    const updatedTask = await Task.findOneAndUpdate({_id:taskId}, body, {new:true});
    res.send(updatedTask)
  } catch (error) {
    next(error)
  }
})
app.delete('/:taskId',async(req, res, next)=>{
  try {
    const {params:{taskId}} = req;
    const deletedTask = await Task.findByIdAndRemove(taskId)
    if(deletedTask){
      return res.send(deletedTask)
    }
    res.sendStatus(404)
  } catch (error) {
    next(error)
  }
})
app.post('/:taskId/comments', async(req, res, next)=>{
  try {
    const {body, params:{taskId}} = req;
    const newComment = await Comment.create({...body, task:taskId});
    res.send(newComment)
  } catch (error) {
    next(error)
  }
})

app.get('/comments', async (req, res, next)=>{
  try {
    Comment.find()
    .populate('task')
    .exec((err,comments)=>{
      if(err){
        throw err
      }
      res.send(comments)
    })    
  } catch (error) {
    next(error)
  }
})

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{console.log('Server started!')});