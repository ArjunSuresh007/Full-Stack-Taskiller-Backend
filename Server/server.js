let express = require('express')
let mongoose = require('mongoose')
let app = express()
let cors = require('cors')
let {User} = require('./model.js') 
require('dotenv').config()

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('Welcome to TodoKiller API page')
  })


app.post('/login',async (req, res) => {
    let {username} = req.body
    let data = await User.findOne({username})
    if(data !== null){
      res.status(201).json({msg:true,id:data._id,todos:data.todos})
    }else{
      res.status(201).json({msg:false})
    }
  })
app.post('/signup', async (req, res) => {
    let {username,password_trail1} = req.body
    let validator = await User.findOne({username})
    if (validator !== null){
      res.status(201).json({msg:false})
    }
    else{
      let new_user = new User({
        username,
        password:password_trail1,
      })
      await new_user.save()
      console.log(new_user)
      res.status(201).json({msg:true,id:new_user._id})
    }
  })


  app.patch('/:id/todo',async (req,res)=>{
    console.log(req.body,req.params.id)
    let u = await User.findOneAndUpdate({username:req.params.id},{$push:{todos: req.body}},{new:true,upsert:true})
    console.log(u.todos)
    res.json({msg:'Todo added',todos:u.todos})
  })

  app.patch('/:username/todo/:id', async (req,res)=>{
    let {id,username} = req.params
    console.log(req.body,req.params.id);
    let deleted = await User.findOneAndUpdate({username},{$pull:{todos: {id}}},{new:true,upsert:true})
    let updated = await User.findOneAndUpdate({username},{$push:{todos: req.body.data}},{new:true,upsert:true})
    console.log(updated.todos)
    res.json({msg:'Todo patched',todos:updated.todos})
  })

  app.delete('/:name/todo/:id',async (req,res)=>{
    console.log(req.params.id,req.params.name)
    let u = await User.findOneAndUpdate({username:req.params.name},{$pull:{todos: {id: req.params.id }}},{new:true,upsert:true})
    console.log(u.todos)
    res.json({msg:'Todo deleted',todos:u.todos})
  })


app.listen(process.env.SERVER_PORT || 3001,()=>{
  mongoose.connect(process.env.DATABASE_URL)
  .then(res=>console.log('instance started'))
    console.log('server turned on ')
  })