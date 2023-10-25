import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Peer } from 'peerjs';

function App() {
  const [myPeerID, setMyPeerID] = useState(null);
  const [myPeer, setMyPeer] = useState(null);
  const [receiverID, setReceiverID] = useState('');
  const myVideo = useRef(null);
  const screenVideo = useRef(null);
  const friendVideo = useRef(null); // Add a third video element for friend's video
  const cameraStream = useRef(null);
  const screenStream = useRef(null);
  const friendStream = useRef(null);
  const isSharingScreen = useRef(false); // Check if screen is being shared

  useEffect(() => {
    const peer = new Peer();

    setMyPeer(peer);

    peer.on('open', function (id) {
      setMyPeerID(id);
      console.log(id)
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        cameraStream.current = stream;
        myVideo.current.srcObject = stream;
        myVideo.current.muted = true;
        myVideo.current.play();
      })
      .catch(function (error) {
        console.error('Error accessing the camera and microphone:', error);
      });

    peer.on('call', function (call) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
        function (stream) {
          call.answer(isSharingScreen.current ? screenStream.current : stream); // Answer with the shared screen or camera stream
          call.on('stream', function (remoteStream) {
            friendStream.current = remoteStream;
            friendVideo.current.srcObject = remoteStream;
            friendVideo.current.play();
          });
        },
        function (err) {
          console.log('Failed to get the local stream', err);
        }
      );
    });
  }, []);

  // Function to share screen
  function shareScreen() {
    if (!isSharingScreen.current) {
      navigator.mediaDevices
        .getDisplayMedia({ video: { cursor: 'always' } })
        .then(function (stream) {
          screenStream.current = stream;
          screenVideo.current.srcObject = stream;
          screenVideo.current.play();
          isSharingScreen.current = true;
          // Share the screen with the friend as well
          const call = myPeer.call(receiverID, screenStream.current);
          call.on('stream', function (remoteStream) {
            friendStream.current = remoteStream;
            friendVideo.current.srcObject = new MediaStream([screenStream.current, cameraStream.current]);
            friendVideo.current.play();
          });
        })
        .catch(function (error) {
          console.error('Error accessing the screen:', error);
        });
    } else {
      // Stop sharing screen
      isSharingScreen.current = false;
      screenStream.current.getTracks().forEach(track => track.stop());
      screenVideo.current.srcObject = null;
      // Resume using the camera stream in your video element
      myVideo.current.srcObject = cameraStream.current;
      myVideo.current.muted = true;
    }
  }

  // Function to call the receiver
  function callTheReceiver() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        const call = myPeer.call(receiverID, isSharingScreen.current ? screenStream.current : stream);
        call.on('stream', function (remoteStream) {
          friendStream.current = remoteStream;
          friendVideo.current.srcObject = remoteStream;
          friendVideo.current.play();
        });
      });
  }

  return (
    <div>
      <div>
        <video style={{ width: '15vw', height: '50vh', border: '' }} ref={myVideo}></video>
        <video style={{ width: '83vw', height: '90vh', border: '' }} ref={friendVideo}></video>
        <video style={{ width: '100vw', height: '45vh', border: '', display: "none" }} ref={screenVideo}></video>
      </div>
      <input
        type="text"
        placeholder="Enter Receiver Peer ID"
        value={receiverID}
        onChange={(e) => setReceiverID(e.target.value)}
      />
      <button onClick={callTheReceiver}>Call</button>
      <button onClick={shareScreen}>{isSharingScreen.current ? 'Stop Sharing' : 'Share Screen'}</button>
    </div>
  );
}

export default App;
