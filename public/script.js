let myvideoStream;
const vidgrid = document.getElementById('video-grid');
const myVid = document.createElement('video');
myVid.muted = true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myvideoStream = stream;
    addVideoStream(myVid,stream);
});
//console.log(myvideoStream)

const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadmetadata',()=>{
        video.play();
    })
   vidgrid.append(video);
}