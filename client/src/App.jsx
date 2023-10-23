import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Peer } from 'peerjs';

function App() {
  const [myPeerID, setMyPeerID] = useState(null);
  const [myPeer, setMyPeer] = useState(null);
  const [receiverID, setReceiverID] = useState('');
  const myVideo = useRef(null);
  const friendVideo = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    setMyPeer(peer);

    peer.on('open', function (id) {
      setMyPeerID(id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        myVideo.current.srcObject = stream;
        myVideo.current.play();
      })
      .catch(function (error) {
        console.error('Error accessing the camera and microphone:', error);
      });

    peer.on('call', function (call) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
        function (stream) {
          call.answer(stream);
          call.on('stream', function (remoteStream) {
            friendVideo.current.srcObject = remoteStream;
            friendVideo.current.play();
          });
        },
        function (err) {
          console.log('Failed to get local stream', err);
        }
      );
    });
  }, []);
  console.log(myPeerID)
  function callTheReceiver() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        let call = myPeer.call(receiverID, stream);
        call.on('stream', function (remoteStream) {
          friendVideo.current.srcObject = remoteStream;
          friendVideo.current.play();
        });
      });
  }

  return (
    <div>
      <div>
        <video style={{ width: '400px', height: '400px', border: '1px solid' }} ref={myVideo}></video>
        <video style={{ width: '400px', height: '400px', border: '1px solid' }} ref={friendVideo}></video>
      </div>
      <input
        type="text"
        placeholder="Enter Receiver Peer ID"
        value={receiverID}
        onChange={(e) => setReceiverID(e.target.value)}
      />
      <button onClick={callTheReceiver}>Call</button>
    </div>
  );
}

export default App;
