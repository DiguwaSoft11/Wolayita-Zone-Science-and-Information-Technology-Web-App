import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import { FaPhoneAlt, FaClipboard } from "react-icons/fa";

// Use your deployed backend URL or local development URL
const socket = io.connect('http://localhost:5000');  // Change this to your deployed backend URL when needed

function VidChat() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [logs, setLogs] = useState([]);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
    console.log(message); // Logging to the console
  };

  const checkMediaDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some(device => device.kind === 'videoinput');
    if (!hasCamera) {
      addLog('No camera detected. Using dummy video stream.');
      const dummyStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(dummyStream);
      if (myVideo.current) {
        myVideo.current.srcObject = dummyStream;
      }
    } else {
      getMediaStream(); // Call getMediaStream if a camera is detected
    }
  } catch (error) {
    addLog('Error enumerating devices: ' + error.message);
  }
};

const getMediaStream = async () => {
  try {
    // Get user media stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(stream);
    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }
    addLog('Media stream acquired successfully.');
  } catch (error) {
    addLog('Error accessing media devices: ' + error.message);
  }
};

useEffect(() => {
  checkMediaDevices();

  socket.on("connect", () => {
    addLog("Connected to the socket server, Socket ID: " + socket.id);
  });

  socket.on("me", (id) => {
    addLog("Received ID from server: " + id);
    setMe(id);
  });

  socket.on("callUser", (data) => {
    addLog("Receiving call from: " + data.from);
    setReceivingCall(true);
    setCaller(data.from);
    setName(data.name);
    setCallerSignal(data.signal);
  });

  socket.on("callAccepted", (signal) => {
    addLog("Call accepted by the user.");
    setCallAccepted(true);
    if (connectionRef.current) {
      connectionRef.current.signal(signal);
    } else {
      addLog("Error: connectionRef.current is undefined when trying to signal.");
    }
  });

  return () => {
    socket.off("connect");
    socket.off("me");
    socket.off("callUser");
    socket.off("callAccepted");
  };
}, []);

  

  const callUser = (id) => {
    addLog("Calling user with ID: " + id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream || undefined, // Use dummy stream if no real stream is available
    });

    peer.on("signal", (data) => {
      addLog("Sending call signal to user: " + id);
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.on("error", (err) => {
      addLog("Peer connection error: " + err.message);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    addLog("Answering call from: " + caller);
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream || undefined, // Use dummy stream if no real stream is available
    });

    peer.on("signal", (data) => {
      addLog("Sending answer signal to caller: " + caller);
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.on("error", (err) => {
      addLog("Peer connection error: " + err.message);
    });

    if (callerSignal) {
      peer.signal(callerSignal);
    } else {
      addLog("Error: callerSignal is undefined.");
    }

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    addLog("Ending call.");
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    } else {
      addLog("Error: connectionRef.current is undefined when trying to destroy.");
    }
  };

  return (
    <>
      <h1 className="text-center text-white text-3xl font-bold my-4">Zoomish</h1>
      <div className="container mx-auto">
        <div className="flex justify-around items-center mb-8">
          <div className="w-1/2 p-2">
            {stream ? (
              <video playsInline muted ref={myVideo} autoPlay className="w-full h-auto rounded" />
            ) : (
              <p>No camera detected. Using dummy video stream.</p>
            )}
          </div>
          <div className="w-1/2 p-2">
            {callAccepted && !callEnded ? (
              <video playsInline ref={userVideo} autoPlay className="w-full h-auto rounded" />
            ) : (
              <p>Waiting for call...</p>
            )}
          </div>
        </div>
        <div className="text-center mb-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded w-64 mb-4"
          />
          <CopyToClipboard text={me}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center space-x-2 mb-4">
              <FaClipboard />
              <span>Copy ID</span>
            </button>
          </CopyToClipboard>
          {me && <p>Your ID: {me}</p>}
          <input
            type="text"
            placeholder="ID to call"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
            className="px-4 py-2 border rounded w-64"
          />
          <div className="mt-4">
            {callAccepted && !callEnded ? (
              <button onClick={leaveCall} className="bg-red-500 text-white px-4 py-2 rounded">
                End Call
              </button>
            ) : (
              <button onClick={() => callUser(idToCall)} className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center space-x-2">
                <FaPhoneAlt />
                <span>Call</span>
              </button>
            )}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="text-center">
              <h1 className="text-white text-2xl mb-4">{name} is calling...</h1>
              <button onClick={answerCall} className="bg-blue-500 text-white px-4 py-2 rounded">
                Answer
              </button>
            </div>
          ) : null}
        </div>
        <div className="logs mt-8 p-4 bg-gray-800 rounded text-white">
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default VidChat;

/*

import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";

// const socket = io.connect('wst-webapp-production.up.railway.app');  // Use your deployed backend URL
const socket = io.connect('http://localhost:5000');  // Use local backend URL for development

function VidChat() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [logs, setLogs] = useState([]);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
    console.log(message); // Logging to the console
  };

  const checkMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      if (!hasCamera) {
        addLog('No camera detected. Using dummy video stream.');
        // Using a dummy video stream when no camera is detected
        const dummyStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(dummyStream);
        if (myVideo.current) {
          myVideo.current.srcObject = dummyStream;
        }
      }
    } catch (error) {
      addLog('Error enumerating devices: ' + error.message);
    }
  };

  useEffect(() => {
    checkMediaDevices();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          if (myVideo.current) {
            myVideo.current.srcObject = stream;
          }
          addLog('Media stream acquired successfully.');
        })
        .catch((error) => {
          addLog('Error accessing media devices: ' + error.message);
        });
    } else {
      addLog('Your browser does not support media devices. Please use a modern browser.');
    }

    socket.on("connect", () => {
      addLog("Connected to the socket server, Socket ID: " + socket.id);
    });

    socket.on("me", (id) => {
      addLog("Received ID from server: " + id);
      setMe(id);
    });

    socket.on("callUser", (data) => {
      addLog("Receiving call from: " + data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket.on("callAccepted", (signal) => {
      addLog("Call accepted by the user.");
      setCallAccepted(true);
      connectionRef.current.signal(signal);
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, []);

  const callUser = (id) => {
    addLog("Calling user with ID: " + id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream || undefined, // Use dummy stream if no real stream is available
    });

    peer.on("signal", (data) => {
      addLog("Sending call signal to user: " + id);
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.on("error", (err) => {
      addLog("Peer connection error: " + err.message);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    addLog("Answering call from: " + caller);
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream || undefined, // Use dummy stream if no real stream is available
    });

    peer.on("signal", (data) => {
      addLog("Sending answer signal to caller: " + caller);
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.on("error", (err) => {
      addLog("Peer connection error: " + err.message);
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    addLog("Ending call.");
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <h1 className="text-center text-white">Zoomish</h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream ? (
              <video playsInline muted ref={myVideo} autoPlay className="video-player" />
            ) : (
              <p>No camera detected. Using dummy video stream.</p>
            )}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video playsInline ref={userVideo} autoPlay className="video-player" />
            ) : (
              <p>Waiting for call...</p>
            )}
          </div>
        </div>
        <div className="myId">
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
              Copy ID
            </Button>
          </CopyToClipboard>
          {me && <p>Your ID: {me}</p>}

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
        <div className="logs">
          {logs.map((log, index) => (
            <p key={index} style={{ color: "white" }}>{log}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default VidChat;



*/
