import React, { Component } from 'react';
import demoVideo from "./demo.mp4"

class VideoFrameDemo extends Component {
 

    async componentDidMount() {
        const frames = await this.extractFramesFromVideo();
        alert(frames.length)
        let video = document.getElementById("video");
        video.style.display = "block"
    }

    async extractFramesFromVideo(fps=0.20) {
        return new Promise(async (resolve) => {

            // // fully download it first (no buffering):
            // let videoBlob = await fetch("https://www.youtube.com/watch?v=Njyx5ZuwEHI").then(r => r.blob());
            // let videoObjectUrl = URL.createObjectURL(videoBlob);
            let video = document.getElementById("video");

            let seekResolve;
            video.addEventListener('seeked', async function() {
                if(seekResolve) seekResolve();
            });

            video.addEventListener('loadeddata', async function () {
                // var canvas = document.createElement('canvas');
                // // let canvas = document.getElementById('prevImgCanvas');
                // let context = canvas.getContext('2d');
                // let [w, h] = [video.videoWidth, video.videoHeight]
                // canvas.width =  w;
                // canvas.height = h;

                let frames = [];
                let interval = 1 / fps;
                let currentTime = 0;
                let duration = video.duration;

                var op = document.getElementById('output')
                var i = 0;
                while (currentTime < duration) {

                    i++;

                    var canvas = document.createElement('canvas');
                    // let canvas = document.getElementById('prevImgCanvas');
                    canvas.id = i
                    let context = canvas.getContext('2d');
                    let [w, h] = [video.videoWidth, video.videoHeight]
                    canvas.width =  w;
                    canvas.height = h;

                    video.currentTime = currentTime;
                    // eslint-disable-next-line
                    await new Promise(r => seekResolve = r);

                    context.drawImage(video, 0, 0, w, h);
                    let base64ImageData = canvas.toDataURL();
                    frames.push(base64ImageData);


                    op.appendChild(canvas)
                    currentTime += interval;
                }
                resolve(frames);
            });


        });
    }

    render() {
        return (
            <div>
                <video id="video" controls autoPlay style={{display:'none'}}>
                    <source src={demoVideo} type="video/mp4"/>
                </video>
                <div id="output" style={{display:'flex', width:'100px', height:'50px'}}></div>
            </div>
        );
    }
}

VideoFrameDemo.propTypes = {

};

export default VideoFrameDemo;