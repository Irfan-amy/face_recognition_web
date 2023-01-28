// import type { NextPage } from "next";
import Head from "next/head";
import Modal from "../components/Modal";
import * as faceapi from "face-api.js";
import React from "react";
import useWindowDimensions from "../hooks/useWindowsDimensions";
import { useRouter } from "next/navigation";
// import registerStaff from "./api/registerStaff";
// import video from "../statics/1.mp4";

const RegisterStaff = () => {
  //model directory
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [recognizerLoaded, setRecognizerLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(true);
  const { height, width } = useWindowDimensions();
  const [hasCapturedImage, setHasCapturedImage] = React.useState(false);
  const [name, setName] = React.useState("false");

  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = React.useState(
    []
  );

  const [modalOn, setModalOn] = React.useState(false);
  const [modalType, setModalType] = React.useState("No Face");
  const [modalError, setModalError] = React.useState("");
  // const [videoWidth, setVideoWidth] = React.useState(width);
  // const [videoHeight, setVideoHeight] = React.useState(height);
  const router = useRouter();
  const videoRef = React.useRef();
  var videoHeight = height;
  var videoWidth = width;
  const canvasRef = React.useRef();
  const canvasRef2 = React.useRef();

  React.useEffect(() => {
    Webcam();
  }, []);
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
  function resumeVideo() {
    setModelsLoaded(true);
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  }

  function stopVideo() {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
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
  function goHome() {
    window.location.href = "/";
  }
  async function captureImage() {
    canvasRef.current.width = videoRef.current.width;
    canvasRef.current.height = videoRef.current.height;

    stopVideo();

    var detections = await drawDetection();
    setHasCapturedImage(true);

    // if (detections.length == 0) {
    //   setModalOn(true);
    //   setModalType("No Face");
    //   cancelImage();
    // } else if (detections.length > 1) {
    //   setModalOn(true);
    //   setModalType("Error");
    //   setModalError("Multiple faces");
    //   cancelImage();
    // }
    if (!detections) {
      setModalOn(true);
      setModalType("No Face");
      cancelImage();
    }

    // setModalOn(true);
  }
  async function drawDetection() {
    const canvas = canvasRef.current;
    const displaySize = {
      width: canvasRef.current.width,
      height: canvasRef.current.height,
    };
    faceapi.matchDimensions(canvas, displaySize);
    console.log("test");
    const detections = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceDescriptor();

    if (!detections) return null;
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    console.log(detections);
    return detections;
  }
  async function registerStaff() {
    var canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.width = videoRef.current.width;
    canvas.height = videoRef.current.height;
    canvas
      .getContext("2d")
      .drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.width,
        videoRef.current.height
      );
    const dataurl = canvas.toDataURL("image/jpeg");
    var result = await fetch("/api/registerStaff", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        dataURL: dataurl,
      }),
    });
    if (result.status == 200) {
      setModalType("Registered");
      setModalOn(true);
    } else {
      const { error } = await result.json();
      console.log(error);
      setModalError(error);
      setModalType("Error");
      setModalOn(true);
    }
  }
  function cancelImage() {
    console.log("test");
    var canvas = document.createElement("canvas");
    canvasRef.current.width = videoRef.current.width;
    canvasRef.current.height = videoRef.current.height;
    canvasRef.current
      .getContext("2d")
      .clearRect(0, 0, canvas.width, canvas.height);
    // setModalOn(true);
    resumeVideo();
    setHasCapturedImage(false);
  }
  function onModalClose() {
    if (modalType == "Registered") {
      goHome();
    }
  }
  return (
    <div>
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
              <canvas
                ref={canvasRef}
                style={{ position: "absolute", zIndex: -1 }}
              />

              {!hasCapturedImage ? (
                <div className="flex flex-row self-end justify-center w-full py-8 mx-8">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      goHome();
                    }}
                    className="absolute left-8 bg-slate-500 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#FFFFFF"
                      className="w-8 h-8"
                    >
                      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      captureImage();
                    }}
                    className="self-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full"
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
              ) : (
                <div className="flex flex-row self-end w-full items-center px-8 py-8 gap-8">
                  <div className="flex-none">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        goHome();
                      }}
                      className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#FFFFFF"
                        className="w-6 h-6"
                      >
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                      </svg>
                    </button>
                  </div>
                  <div className="grow flex flex-row gap-4 md:px-16">
                    <div className="flex grow">
                      <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id="inline-full-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                    </div>
                    <div className="flex flex-row flex-none gap-2">
                      <div className="w-1/2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            registerStaff();
                          }}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#ffffff"
                            className="w-6 h-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="w-1/2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            cancelImage();
                          }}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#ffffff"
                            className="w-6 h-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : (
        <></>
      )}
      {modalOn && (
        <Modal
          setModalOn={setModalOn}
          modalType={modalType}
          modalError={modalError}
          onClose={() => {
            onModalClose();
          }}
        />
      )}
    </div>
  );
};
export default RegisterStaff;
