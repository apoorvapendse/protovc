import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Peer } from "peerjs";

function App() {
  const [myPeerID, setMyPeerID] = useState(null);
  const [myPeer, setMyPeer] = useState(null);
  const [receiverID, setReceiverID] = useState("");
  const myVideo = useRef(null);
  const friendVideo = useRef(null);

  const [myPeer2, setMyPeer2] = useState(new Peer());
  const myScreen = useRef(null);
  const [screenID, setScreenID] = useState("");

  useEffect(() => {
    const peer = new Peer();

    setMyPeer(peer);

    peer.on("open", function (id) {
      setMyPeerID(id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        myVideo.current.srcObject = stream;
        myVideo.current.play();
      })
      .catch(function (error) {
        console.error("Error accessing the camera and microphone:", error);
      });

    // navigator.mediaDevices
    //   .getDisplayMedia({ video: true })
    //   .then((screen) => {
    //     myScreen.current.srcObject = screen;
    //     myScreen.current.play();
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });

    peer.on("call", function (call) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
        function (stream) {
          call.answer(stream);
          call.on("stream", function (remoteStream) {
            friendVideo.current.srcObject = remoteStream;
            friendVideo.current.play();
          });
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );
    });
    myPeer2.on("call", function (call) {
      call.answer(null);
      call.on("stream", function (remoteStream) {
        myScreen.current.srcObject = remoteStream;
        myScreen.current.play();
      });
    });
  }, []);
  console.log("peerID", myPeerID);
  console.log("screenID", myPeer2.id);
  function callTheReceiver() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        let call = myPeer.call(receiverID, stream);
        call.on("stream", function (remoteStream) {
          friendVideo.current.srcObject = remoteStream;
          friendVideo.current.play();
        });
      });
  }
  function shareScreen() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(function (stream) {
        let ss = myPeer2.call(screenID, stream);
        ss.on("stream", function (remoteStream) {
          myScreen.current.srcObject = remoteStream;
          myScreen.current.play();
        });
      })
      .catch((e) => console.log(e));
  }

  return (
    <div>
      <div>
        <video
          style={{ width: "400px", height: "400px", border: "1px solid" }}
          ref={myVideo}
        ></video>
        <video
          style={{ width: "400px", height: "400px", border: "1px solid" }}
          ref={myScreen}
        ></video>
        <video
          style={{ width: "400px", height: "400px", border: "1px solid" }}
          ref={friendVideo}
        ></video>
      </div>
      <input
        type="text"
        placeholder="Enter Receiver Peer ID"
        value={receiverID}
        onChange={(e) => setReceiverID(e.target.value)}
      />
      <button onClick={callTheReceiver}>Call</button>
      <input
        type="text"
        placeholder="Enter Receiver Screen ID"
        // value={receiverID}
        onChange={(e) => setScreenID(e.target.value)}
      />
      <button onClick={shareScreen}>Share</button>
    </div>
  );
}

export default App;
