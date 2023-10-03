let {model,Schema} = require('mongoose')

let userSchema = new Schema({
    username:String,
    password:String,
    todos:[
        {
            title:String,
            time:String,
            deadline:String,
            completed:Boolean,
            id:Number,
        }
    ]
},{timestamps: true})

const User = model('User',userSchema)

module.exports = {
    User
}