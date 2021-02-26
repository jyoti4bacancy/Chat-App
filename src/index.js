const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const PORT=process.env.PORT||3000
const publicPathDirectory=path.join(__dirname,'../public')
app.use(express.static(publicPathDirectory))


io.on('connection',(socket)=>{
     console.log("new user connected.")

    socket.on('join',({username,room},callback)=>{
     const {error,user}=addUser({id:socket.id,username,room})
     if(error){
         return callback(error)
     }
         socket.join(user.room)//inbuilt method of socket
        socket.emit('message',generateMessage('Admin','welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    //socket.emit--for specific connection
    //io.emit-- to send all connected users
    //socket.broadcast.emit()--- to send all connected users
    //socket.to().emit()-- to send specific room to particular person
    //socket.broadcast.to().emit():- to send msg in specific room to all users

    })
    socket.on('sendmsg',(message,callback)=>{
        
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('profinity is not allowed')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`http://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
    })

    socket.on('disconnect',()=>{

        const user=removeUser(socket.id)
        if(user){
        io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    }
    })

})


server.listen(PORT,()=>{
    console.log('application is listining on '+PORT)
})