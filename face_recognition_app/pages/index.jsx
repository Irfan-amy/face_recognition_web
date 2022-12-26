// import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import * as faceapi from "face-api.js";
import React from "react";
import useWindowDimensions from "../hooks/useWindowsDimensions";
// import video from "../statics/1.mp4";

const Home = () => {
  //model directory
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [recognizerLoaded, setRecognizerLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(true);
  const { height, width } = useWindowDimensions();
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = React.useState(
    []
  );
  // const [videoWidth, setVideoWidth] = React.useState(width);
  // const [videoHeight, setVideoHeight] = React.useState(height);

  const videoRef = React.useRef();
  var videoHeight = height;
  var videoWidth = width;
  const canvasRef = React.useRef();

  // React.useEffect(() => {
  //   const loadModels = async () => {
  //     const MODEL_URL = "/static/weights";
  //     await Promise.all([
  //       faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
  //       faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  //       faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  //       faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  //       faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  //     ]);
  //     setModelsLoaded(true);
  //   };
  //   loadModels().then(async () => {
  //     const labels = ["Irfan"];
  //     var result = await Promise.all(
  //       labels.map(async (label) => {
  //         const imgUrl = `images/${label}.jpg`;
  //         console.log(imgUrl);
  //         const img = await faceapi.fetchImage(imgUrl);

  //         const faceDescription = await faceapi
  //           .detectSingleFace(img)
  //           .withFaceLandmarks()
  //           .withFaceDescriptor();
  //         if (!faceDescription) {
  //           throw new Error(`no faces detected for ${label}`);
  //         }

  //         const faceDescriptors = [faceDescription.descriptor];
  //         console.log(
  //           "test " + new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
  //         );
  //         return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
  //       })
  //     );
  //     setLabeledFaceDescriptors([...result]);
  //     setRecognizerLoaded(true);
  //     console.log("test " + result.length);
  //     console.log("test2 " + labeledFaceDescriptors.length);
  //   });
    // navigator.mediaDevices
    //   .getUserMedia({ video: { width: 300 } })
    //   .then((stream) => {
    //     let video = videoRef.current;
    //     video.srcObject = stream;
    //     video.play();
    //   })
    //   .catch((err) => {
    //     console.error("error:", err);
    //   });
  //   // setVideoWidth(videoRef.width)
  //   // setVideoHeight(videoRef.height)
  //   videoWidth = videoRef.width;
  //   videoHeight = videoRef.height;
  // }, []);

  // const startVideo = () => {
  //   setCaptureVideo(true);
  // };

  // const handleVideoOnPlay = () => {
  //   setInterval(async () => {
  //     if (canvasRef && canvasRef.current && modelsLoaded) {
  //       // canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
  //       //   videoRef.current
  //       // );
  //       const canvas = faceapi.createCanvas(videoRef.current);
  //       const displaySize = {
  //         width: videoWidth,
  //         height: videoHeight,
  //       };

  //       faceapi.matchDimensions(canvasRef.current, displaySize);

  //       const detections = await faceapi
  //         .detectAllFaces(
  //           videoRef.current,
  //           new faceapi.TinyFaceDetectorOptions()
  //         )
  //         .withFaceLandmarks()
  //         .withFaceExpressions();

  //       const resizedDetections = faceapi.resizeResults(
  //         detections,
  //         displaySize
  //       );

  //       canvasRef &&
  //         canvasRef.current &&
  //         canvasRef.current
  //           .getContext("2d")
  //           .clearRect(0, 0, videoWidth, videoHeight);
  //       canvasRef &&
  //         canvasRef.current &&
          
  //       canvasRef &&
  //         canvasRef.current &&
  //         faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
  //       canvasRef &&
  //         canvasRef.current &&
  //         faceapi.draw.drawFaceExpressions(
  //           canvasRef.current,
  //           resizedDetections
  //         );
  //     }
  //     console.log(recognizerLoaded);
  //     if (recognizerLoaded) {
  //       console.log("test");
  //       const threshold = 0.6;
  //       const faceMatcher = new faceapi.FaceMatcher(
  //         labeledFaceDescriptors,
  //         threshold
  //       );

  //       const results = faceDescriptions.map((fd) =>
  //         faceMatcher.findBestMatch(fd.descriptor)
  //       );
  //       results.forEach((bestMatch, i) => {
  //         const box = faceDescriptions[i].detection.box;
  //         const text = bestMatch.toString();
  //         const drawBox = new faceapi.draw.DrawBox(box, { label: text });
  //         console.log(text);
  //       });
  //     }
  //   }, 100);
  // };

  // const closeWebcam = () => {
    // videoRef.current.pause();
    // videoRef.current.srcObject.getTracks()[0].stop();
    // setCaptureVideo(false);
  // };
  React.useEffect(() => {
    Webcam();
  }, []);
  const [name, setName] = React.useState("");
  async function Webcam() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/static/weights"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/static/weights"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/static/weights"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/static/weights"),
    ]).then(startVideo);
    // const video = document.getElementById('video')
    function startVideo() {
      setModelsLoaded(true);
      navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        // video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
    }

    
  }
  const handleVideoOnPlay = () => {
    // const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    const canvas = canvasRef.current;
    // document.body.append(canvas);
    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };
    faceapi.matchDimensions(canvas, displaySize);

    let labeledFaceDescriptors;
    (async () => {
      labeledFaceDescriptors = await loadLabeledImages();
    })();

    

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      // console.log(detections);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      if (labeledFaceDescriptors) {
        const faceMatcher = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          0.6
        );
        const results = resizedDetections.map((data) =>
          faceMatcher.findBestMatch(data.descriptor)
        );
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          setName(result.toString());
          console.log("name : " + name);
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
          // faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          drawBox.draw(canvas)
        });
      }
    }, 100);
    function loadLabeledImages() {
      const labels = ["Irfan","Irfan2"];
      return Promise.all(
        labels.map(async (label) => {
          const descriptions = [];
          const img = await faceapi.fetchImage(`/images/${label}.jpg`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    }
  //   function loadLabeledImages() {
  //     const labels = ['Irfan'];
  //     return Promise.all(
  //         labels.map(async label => {
  //             const descriptions = []
  //             for (let i = 1; i <= 7; i++) {
  //                 const img = await faceapi.fetchImage(`/static/images/${label}.jpg`)
  //                 const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
  //                 descriptions.push(detections.descriptor)
  //             }
  //             return new faceapi.LabeledFaceDescriptors(label, descriptions)
  //         })
  //     )
  // }
  };
  return (
    <div>
      {/* <div style={{ textAlign: "center", padding: "10px" }}>
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Close Webcam
          </button>
        ) : (
          <button
            onClick={startVideo}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Open Webcam
          </button>
        )}
      </div> */}
      {captureVideo ? (
        modelsLoaded ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // padding: "10px",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ objectFit: "cover", width: width, height: height }}
              ></video>
              <canvas ref={canvasRef} style={{ position: "absolute" }} />
            </div>
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
