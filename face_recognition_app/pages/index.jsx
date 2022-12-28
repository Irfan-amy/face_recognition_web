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
  function goStaffList() {
    window.location.href = "/staffList";
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
          const drawBox = new faceapi.draw.DrawBox(box, {
            label: result.toString(),
          });
          // faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          drawBox.draw(canvas);
        });
      }
    }, 100);
    async function loadLabeledImages() {
      if (null) console.log("True");
      var result = await fetch("/api/getStaffList", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (result.status == 200) {
        const { staffList } = await result.json();
        if (staffList.length == 0) return null;
        return await Promise.all(
          staffList.map(async (staffName) => {
            const descriptions = [];
            const img = await faceapi.fetchImage(
              `https://fbfvbgubjvmufzrwrhsf.supabase.co/storage/v1/object/public/images/${staffName}.jpg`
            );
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections.descriptor);
            return new faceapi.LabeledFaceDescriptors(staffName, descriptions);
          })
        );
      } else {
        return null;
      }
      const labels = ["Irfan", "Irfan2"];
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
                onPlay={handleVideoOnPlay}
                style={{
                  position: "absolute",
                  objectFit: "cover",
                  width: width,
                  height: height,
                  zIndex: -2,
                }}
              ></video>
              <canvas
                ref={canvasRef}
                style={{ position: "absolute", zIndex: -1 }}
              />
              <div className="flex flex-row self-end justify-center w-full py-8 mx-8">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    goStaffList();
                  }}
                  className="self-center bg-slate-500 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-8 h-8"
                  >
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
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

export default Home;
