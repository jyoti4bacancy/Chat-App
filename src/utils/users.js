const users=[]
//addUser removeUser getUser

const addUser= ({id,username,room})=>{
   //clean data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate data
    if(!username|| !room){
        return {
            error:'username and room not exist!'
        }
    }

    //check for existing user

    const existingUser= users.find((user)=>{
        return user.username===username&& user.room===room
    })
    //duplicate user

    if(existingUser){
        return{
            error:'user already added to this room!'
        }
    }

    //store user
      const user={id,username,room}
      users.push(user)
      return {user}
}

//remove user
const removeUser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)
    if(index != -1){
        //users.spice()=to remove user syntax splice(value of index want to delete,how many values wants to delete)
        //splice()returns array of deleted users and we access each 0 index value
       return users.splice(index,1)[0]
    }
}

//get user
const getUser=(id)=>{
   return users.find((user)=>user.id===id)
}

//getusersIn Room

const getUsersInRoom=(room)=>{
    return users.filter((user)=> user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



// addUser({
//     id:2,
//     username:'jyoti   ',
//     room:'delhi'
// })


// addUser({
//     id:3,
//     username:'sheetal',
//     room:'delhi'
// })

// addUser({
//     id:4,
//     username:'jyoti   ',
//     room:'gujarat'
// })
//console.log(users)

// const readuser=getUser(4)
// console.log(readuser)

// const getroom= getUsersInRoom('delhi')
// console.log(getroom)

// const removeduser=removeUser(2)
// console.log(removeduser)
// console.log(users)