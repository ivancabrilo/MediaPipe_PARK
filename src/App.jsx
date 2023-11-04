import "./App.css";

import { FaceMesh } from "@mediapipe/face_mesh";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;
  const connect = window.drawConnectors;
  function onResults(results) {
    // Setting H,W of Canvas

    canvasRef.current.widht = webcamRef.current.video.videoWidth;
    canvasRef.current.height = webcamRef.current.video.videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiFaceLandmarks) {
      // Log the number of faces detected
      console.log(
        "Number of faces detected:",
        results.multiFaceLandmarks.length
      );

      if (results.multiFaceLandmarks.length > 1) {
        alert("Please only one face");
      }

      // for (const landmarks of results.multiFaceLandmarks) {
      //   connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
      //     color: "#C0C0C070",
      //     lineWidth: 1,
      //   });

      // }
    }
    canvasCtx.restore();
    //   if (results.multiFaceLandmarks) {
    //     for (const landmarks of results.multiFaceLandmarks) {
    //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
    //         color: "#C0C0C070",
    //         lineWidth: 1,
    //       });
    //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
    //         color: "#FF3030",
    //       });
    //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
    //         color: "#FF3030",
    //       });
    //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
    //         color: "#30FF30",
    //       });
    //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
    //         color: "#30FF30",
    //       });
    //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
    //         color: "#E0E0E0",
    //       });
    //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
    //         color: "#E0E0E0",
    //       });
    //     }
    //   }
  }
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    faceMesh.setOptions({
      maxNumFaces: 3,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
    }
    camera.start();
  });

  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginRight: "auto",
          marginLeft: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginRight: "auto",
          marginLeft: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      ></canvas>
    </div>
  );
}
export default App;
