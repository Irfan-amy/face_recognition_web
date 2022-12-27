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

  return (
    <section className="flex gap-0 bg-black">
      <div className="flex flex-col w-full h-screen">
        <div className="px-16 py-16 font-[Montserrat]  flex flex-col">
          <div className="bg-white rounded-lg px-16 py-12">
            <h1 className="font-semibold text-3xl pb-4">Staff List</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
