const socket = io('/');
let myvideoStream;
const vidgrid = document.getElementById('video-grid');
const myVid = document.createElement('video');
myVid.muted = true;

//making a new peer connection
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '4000'
});

const peersJoined = {};
//getting user media devices
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myvideoStream = stream;
    addVideoStream(myVid,stream);

    //making a call
    socket.on('user-connected',(userID)=>{
        connectToNewUser(userID,stream);
    });

    //answering a call
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video,userVideoStream)
        })
    })
});

//making a new peer-to-peer connection
peer.on('open', id=>{
    socket.emit('join-room', room-id, id);
})

//listening to connections from the server
//socket.emit('join-room', room-id);


const connectToNewUser = (userID,stream)=>{
    var call = peer.call(userID, stream);
    const video =  document.createElement('video');
    call.on('stream', userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
    call.on('close',()=>{
        video.remove();
    })
    peersJoined[userID] = call;
    console.log(peersJoined)
}
//function to add a new  video stream to the page
const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
   vidgrid.append(video);
}

//muting and unmuting the audio
const muteUnmute = ()=>{
    const enabled = myvideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myvideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myvideoStream.getAudioTracks()[0].enabled = true;
    }
}

//to stop the video 
const playStop = () => {
    //console.log('object')
    let enabled = myvideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myvideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myvideoStream.getVideoTracks()[0].enabled = true;
    }
  }

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main-mute-button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main-mute-button').innerHTML = html;
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main-video-button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main-video-button').innerHTML = html;
 }

 //chat messaging
 //let text = document.getElementById('chat-message');
 let text = $("input");
 
 $('html').keydown((e)=>{
     if(e.which == 13 && text.val().length !== 0){
        //console.log(text.val())
         socket.emit('message',text.val());
         text.val(' ');
     }
 })
 socket.on('createMessage', (message) =>{
     console.log('from server', message)
     $("ul").append(`<li class="message"><b>User</b><br/>${message}</li>`);
     scrollToBottom();
 });
 socket.on('user-disconnected',(userID)=>{
     if(peersJoined[userID]){
        peersJoined[userID].close()
     }
 });

 const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
 
