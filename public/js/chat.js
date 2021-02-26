const socket=io()
//elements
const $messageForm=document.querySelector('#message-form')
const $formButton=$messageForm.querySelector('button')
const $formInput=$messageForm.querySelector('input')
const $locButton=document.querySelector('#send-location')
const $message=document.querySelector('#message')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//options
//location.search returns ?username="jyoti"&room="place", ignoreprefix to ignore ?
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    //new message element
    const $newMessage=$message.lastElementChild
    //height of new message
    const newMessageStyle=getComputedStyle($newMessage)
      const newMessageMargin=parseInt(newMessageStyle.marginBottom)
      const newMessagehieght= $newMessage.offsetHeight + newMessageMargin

      const visibleHieght=$message.offsetHeight;

      const containerHeight=$message.scrollHeight
      const scrollOffset= $message.scrollTop+ visibleHieght

      if(containerHeight- newMessagehieght <=scrollOffset)
      {
          $message.scrollTop=$message.scrollHeight
      }
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm A')  //h: hour in 1 digit, mm:minute in 2 digit,   A: AM/PM in uppercase/////////////////////

    }) 
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(urlMessage)=>{
    console.log(urlMessage)
    const html=Mustache.render(locationMessageTemplate,{
        username:urlMessage.username,
        url:urlMessage.url,
        createdAt:moment(urlMessage.createdAt).format('h:mm A')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('roomData',({room,users})=>{
   const html=Mustache.render(sidebarTemplate,{
       room,
       users
   })
   document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    // const message=document.querySelector('input').value
     $formButton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value

    //here the third argumnet of emit function is acknowlegmnet for user that message is delivered or not from server.
    socket.emit('sendmsg',message,(error)=>{
        $formButton.removeAttribute('disabled')
        $formInput.value=''
        $formInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message delivered')
    })
})

$locButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser.')
    }
    //$locButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit('sendLocation',{latitude:position.coords.latitude,
                longitude: position.coords.longitude },()=>{
                $locButton.removeAttribute('disabled')
                console.log('location shared!')
            })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})