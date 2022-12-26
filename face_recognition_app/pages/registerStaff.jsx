// import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import * as faceapi from "face-api.js";
import React from "react";
import useWindowDimensions from "../hooks/useWindowsDimensions";
// import video from "../statics/1.mp4";

const RegisterStaff = () => {
  //model directory
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [recognizerLoaded, setRecognizerLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(true);
  const { height, width } = useWindowDimensions();
  const [hasCapturedImage, setHasCapturedImage] = React.useState(false);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = React.useState(
    []
  );
  // const [videoWidth, setVideoWidth] = React.useState(width);
  // const [videoHeight, setVideoHeight] = React.useState(height);

  const videoRef = React.useRef();
  var videoHeight = height;
  var videoWidth = width;
  const canvasRef = React.useRef();

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
  //   const handleVideoOnPlay = () => {
  //     // const canvas = faceapi.createCanvasFromMedia(videoRef.current);
  //     const canvas = canvasRef.current;
  //     // document.body.append(canvas);
  //     const displaySize = {
  //       width: videoRef.current.width,
  //       height: videoRef.current.height,
  //     };
  //     faceapi.matchDimensions(canvas, displaySize);

  //     let labeledFaceDescriptors;
  //     (async () => {
  //       labeledFaceDescriptors = await loadLabeledImages();
  //     })();

  //     setInterval(async () => {
  //       const detections = await faceapi
  //         .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
  //         .withFaceLandmarks()
  //         .withFaceDescriptors();
  //       // console.log(detections);
  //       const resizedDetections = faceapi.resizeResults(detections, displaySize);
  //       canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  //       if (labeledFaceDescriptors) {
  //         const faceMatcher = new faceapi.FaceMatcher(
  //           labeledFaceDescriptors,
  //           0.6
  //         );
  //         const results = resizedDetections.map((data) =>
  //           faceMatcher.findBestMatch(data.descriptor)
  //         );
  //         results.forEach((result, i) => {
  //           const box = resizedDetections[i].detection.box;
  //           setName(result.toString());
  //           console.log("name : " + name);
  //           const drawBox = new faceapi.draw.DrawBox(box, {
  //             label: result.toString(),
  //           });

  //           drawBox.draw(canvas);
  //         });
  //       }
  //     }, 100);
  //   };

  function loadLabeledImages() {
    const labels = ["Irfan", "Irfan2"];
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
  function captureImage() {
    console.log("test");
    var canvas = document.createElement("canvas");
    canvasRef.current.width = videoRef.current.width;
    canvasRef.current.height = videoRef.current.height;
    canvasRef.current
      .getContext("2d")
      .drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.width,
        videoRef.current.height
      );
  }
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
                width: "100vw",
                height: "100vh",
                // padding: "10px",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                height={videoHeight}
                width={videoWidth}
                style={{
                  objectFit: "cover",
                  width: width,
                  height: height,
                  position: "absolute",
                  zIndex: -2,
                }}
              ></video>
              <canvas ref={canvasRef} style={{ position: "absolute", zIndex:-1 }} />
              <div className="flex-row self-end py-8">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    captureImage();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-8 h-8"
                  >
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path
                      fillRule="evenodd"
                      d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
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
export default RegisterStaff;
