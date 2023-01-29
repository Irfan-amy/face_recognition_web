// import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Moment from "moment";

import * as faceapi from "face-api.js";
import React, { useEffect } from "react";
import useWindowDimensions from "../hooks/useWindowsDimensions";
// import video from "../statics/1.mp4";


let labeledFaceDescriptors;

const RealtimeAttendance = () => {
  //model directory
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [hasAttendance, setHasAttendance] = React.useState(false);
  const [checkTime, setCheckTime] = React.useState(new Date());
  const [checkName, setCheckName] = React.useState("");
  const [recognizerLoaded, setRecognizerLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(true);
  //   const [isCheckIn, setIsCheckIn] = React.useState(true);
  const { height, width } = useWindowDimensions();
  // const [labeledFaceDescriptors, setLabeledFaceDescriptors] =
  //   React.useState(null);

  // const [videoWidth, setVideoWidth] = React.useState(width);
  // const [videoHeight, setVideoHeight] = React.useState(height);

  const isCheckIn = true;
  const videoRef = React.useRef();
  var videoHeight = height;
  var videoWidth = width;
  const threshold = 0.45;
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

    function startVideo() {
      setModelsLoaded(true);
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error("error:", err);
        });
    }
  }

  const makeDetections = async () => {
    if (videoRef.current) {
      if (!videoRef.current.readyState == 4) {
        console.log(videoRef.current.readyState);
        requestAnimationFrame(makeDetections);
      } else {
        await detectionProcess();
        requestAnimationFrame(makeDetections);
      }
    }
  };

  async function detectionProcess() {
    const canvas = canvasRef.current;
    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    if (labeledFaceDescriptors) {
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      const results = resizedDetections.map((data) =>
        faceMatcher.findBestMatch(data.descriptor)
      );

      results.forEach((result, i) => {
        if (result.distance <= threshold) {
          writeAttendance(result.label);
        }
        const box = resizedDetections[i].detection.box;
        setName(result.toString());
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvas);
      });
      // console.log("Name:" , name);
    }
  }

  async function loadLabeledImages() {
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
        staffList
          .filter(function (staffName) {
            return !!staffName;
          })
          .map(async (staffName) => {
            console.log(staffName);
            const descriptions = [];
            const img = await faceapi.fetchImage(
              `https://fbfvbgubjvmufzrwrhsf.supabase.co/storage/v1/object/public/images/${staffName}.jpg`
            );

            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            console.log(
              detections,
              `https://fbfvbgubjvmufzrwrhsf.supabase.co/storage/v1/object/public/images/${staffName}.jpg`
            );
            descriptions.push(detections.descriptor);
            return new faceapi.LabeledFaceDescriptors(staffName, descriptions);
          })
      );
    } else {
      return null;
    }
  }
  function goStaffList() {
    window.location.href = "/staffList";
  }

  useEffect(() => {
    Moment.locale("en");
  }, []);

  const handleVideoOnPlay = () => {
    const canvas = canvasRef.current;
    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };
    faceapi.matchDimensions(canvas, displaySize);

    makeDetections();

    (async () => {
      labeledFaceDescriptors = await loadLabeledImages();
    })();
  };

  function checkButton() {
    goCheckOut();
  }

  function goCheckOut() {
    window.location.href = "/checkOut";
  }

  function goAttendances() {
    window.location.href = "/attendances";
  }
  async function writeAttendance(name) {
    if (name == "unknown") {
      return;
    }

    let currentTime = new Date();
    let args = {
      name: name,
      date: Moment(currentTime).format("DD/MM/YYYY"),
    };
    if (isCheckIn) args.checkInTime = Moment(currentTime).format("HH:mm:ss");
    else args.checkOutTime = Moment(currentTime).format("HH:mm:ss");

    var result = await fetch("/api/registerAttendance", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(args),
    });
    if (result.status == 200) {
      const { error } = await result.json();
      if (error) {
        console.log("Error : ", error);
        return;
      }
      setCheckName(name);
      setHasAttendance(true);
      setCheckTime(currentTime);
    }
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
              <div className="absolute left-8 top-8 justify-center">
                {isCheckIn ? (
                  <div className="bg-blue-500/[.45] font-[Montserrat] text-white px-4 py-2 text-[14px] rounded-lg ">
                    Check in
                  </div>
                ) : (
                  <div className="bg-red-500/[.45] font-[Montserrat] text-white px-4 py-2 text-[14px] rounded-lg ">
                    Check out
                  </div>
                )}
              </div>
              <div className="flex flex-col-reverse self-end w-full mx-8 ">
                <div className="flex flex-row justify-center w-full py-8  gap-2">
                  <div className="flex-none">
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
                        className="w-6 h-6"
                      >
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-none">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        goAttendances();
                      }}
                      className="self-center bg-slate-500 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                        <path
                          fillRule="evenodd"
                          d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(name);
                        }}
                        className="h-full self-center bg-red-500 hover:bg-red-700 text-white font-[Montserrat] font-bold py-4 px-4 rounded-full inline-flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#ffffff"
                          className="w-6 h-6 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                          />
                        </svg>

                        <span className=" text-[14px] font-semibold">
                          Nigga
                        </span>
                      </button>
                  {/* <div className="grow flex bg-white rounded-lg">
                    <div className="self-center px-8  font-[Montserrat] font-semibold">
                      Tets
                    </div>
                  </div> */}
                  <div className="flex-none">
                    {isCheckIn ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          checkButton();
                        }}
                        className="h-full self-center bg-red-500 hover:bg-red-700 text-white font-[Montserrat] font-bold py-4 px-4 rounded-full inline-flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#ffffff"
                          className="w-6 h-6 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                          />
                        </svg>

                        <span className=" text-[14px] font-semibold">
                          Check out 
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          checkButton();
                        }}
                        className="h-full self-center bg-blue-500 hover:bg-blue-700 text-white font-[Montserrat] font-bold py-4 px-4 rounded-full inline-flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                          />
                        </svg>

                        <span className=" text-[14px] font-semibold">
                          Check In
                        </span>
                      </button>
                    )}
                  </div>
                </div>
                {hasAttendance ? (
                  <div className="flex flex-row justify-center py-2  gap-8">
                    <div className="justify-center gap-2 flex flex-row bg-white rounded-lg">
                      <div className=" px-8 py-4  font-[Montserrat] text-[14px] md:text-[16px] lg:text-[18px] font-semibold">
                        {checkName}
                      </div>
                      <div className="s px-8 py-4  font-[Montserrat] text-[14px] md:text-[16px] lg:text-[18px] font-regular">
                        {isCheckIn ? "Check in" : "Check out"} :{" "}
                        {Moment(checkTime).format("DD/MM/YYYY HH:mm:ss")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
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

export default RealtimeAttendance;
