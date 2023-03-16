import { useEffect,  useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./scss/MainCallScreen.scss";
import MeetingInfo from "../MeetingInfo/MeetingInfo";
import CallPageFooter from "../CallScreenFooter/CallScreenFooter";
import CallPageHeader from "../CallScreenHeader/CallScreenHeader";
import { browserName } from "react-device-detect";
import Peer from "simple-peer";
import {
  getDisplayEmail,
  getDisplayUserName,
  getUser,
} from "../../../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import GreenRoom from "../GreenRoom/GreenRoom";
import {
  getIsAudio,
  getIsVideo,
} from "../GreenRoom/greenroomSettings";
import {
  baseURL,
} from "../../../utils/constants";
import StyledDiv from "./styledDiv";
import resizeParticipantsList from "./resizeParticipantsList";
import { checkValidRoomId } from "./checkValidRoomId";
import Video from "./participantsVideo";


let sec = 0;
let min = 0;
let hour = 0;

const MainCallScreen = () => {
  const navigate = useNavigate();

  const userName = getUser();
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  const dishRef = useRef();
  const roomID = useParams().roomID;
  const isAdmin = window.location.hash === "#init" ? true : false;
  const url = `${window.location.origin}${window.location.pathname}`;
  let alertTimeout = null;
  const [displayUserName, setDisplayUsername] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");

  const [callPageFooter, setCallPageFooter] = useState(true);
  const [callPageHeader, setCallPageHeader] = useState(true);

  const [meetInfoPopup, setMeetInfoPopup] = useState(false);
  const [meetingInitiatorUserName, setMeetingInitiatorUserName] =
    useState(null);
  
  
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);

  const [isGreenRoomSet, setGreenRoomSettings] = useState(false);
  
  const [isUpdateAudioState, updateAudioState] = useState(false);
  const [isUpdateVideoState, updateVideoState] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);
  const [meetingDuration, setMeetingDuration] = useState(null);
  const [isMeetingStart, setIsMeetingStart] = useState(false);

  const [Videoheight, setVideoheight] = useState("100%");
  const [Videowidth, setVideowidth] = useState("100%");
  const [audioInput, setAudioInputs] = useState([]);
  const [audioOutput, setAudioOutputs] = useState([]);
  const [videoSource, setVideoSource] = useState([]);
  const [audioInputSelect, setaudioInputSelect] = useState("default");
  const [audioOutputSelect, setaudioOutputSelect] = useState();
  const [videoSelect, setvideoSelect] = useState();


  useEffect(() => {
    console.log("Connecting video conference...");
    socketRef.current = io.connect(baseURL);
    setDisplayUsername(userName);
    setDisplayEmail(userName);
  }, []);

  useEffect(() => {
    if (isGreenRoomSet) {
      console.log("GreenRoom Set...");
      setDisplayUsername(getDisplayUserName());
      setDisplayEmail(getDisplayEmail());
      if (isAdmin) {
        setMeetInfoPopup(true);
        callUseEffect();
      } else
        checkValidRoomId(
          socketRef,
          callUseEffect,
          navigate,
        );
    } else {
      if (!isAdmin) {
        let oldpathname = window.location.pathname;
        let newPathname = oldpathname.slice(1);
        socketRef.current.emit("checkIsRoomIDExist", {
          roomID: newPathname,
        });
        socketRef.current.on("roomStatus", (status) => {
          if (!status.isValid) {
            navigate("/invalidurl", { replace: true });
            window.location.reload();
          }
        });
      }
    }
  }, [isGreenRoomSet]);

  useEffect(() => {
    console.log("Connected Count useEffect...");
    if (connectedCount > 0) {
      resizeParticipantsList(
        connectedCount,
        setVideoheight,
        setVideowidth,
        dishRef
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedCount]);

  useEffect(() => {
    if (!isUpdateAudioState) {
      socketRef.current.on("receiving_audio_status", (payload) => {
        peersRef.current.map((index) => {
          if (index.peerID === payload.callerID)
            index.isAudio = payload.isAudio;
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateAudioState]);

  useEffect(() => {
    socketRef.current.on("disconnect_all", (payload) => {
      if (payload.isDisconnectAll) {
        //console.log("Meeting Disconnect for all : " + JSON.stringify(payload));
        peers.map((peer, index) => {
          return peer.destroy();
        });
        navigate(`/`, { replace: true });
        window.location.reload();
      } else {
        for (var i = 0; i < peersRef.current.length; i++) {
          if (peersRef.current[i].userName === payload.userName) {
            peersRef.current.splice(i, 1);
            i--;
          }
        }
        setConnectedCount(payload.connectedUsers);
      }
    });
  }, []);

  useEffect(() => {
    socketRef.current.on("disconnect_specific_userCall", (payload) => {
      let uName = getDisplayUserName();
      if (payload.userName === uName) disconnectCall();
      else {
        for (var i = 0; i < peersRef.current.length; i++) {
          if (peersRef.current[i].userName === payload.userName) {
            peersRef.current.splice(i, 1);
            i--;
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!isUpdateVideoState) {
      socketRef.current.on("receiving_video_status", (payload) => {
        //console.log("receiving_video_status : " + JSON.stringify(payload));
        peersRef.current.map((index) => {
          if (index.peerID === payload.callerID)
            index.isVideo = payload.isVideo;
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateVideoState]);


  useEffect(() => {
    let Interval = null;
    if (isMeetingStart) {
      if (isAdmin) {
        Interval = setInterval(() => {
          if (sec === 59) {
            sec = 0;
            min++;
            if (min === 60) {
              min = 0;
              hour++;
            }
          } else {
            sec++;
          }

          let newTime =
            (hour < 10 ? "0" : "") +
            hour +
            ":" +
            (min < 10 ? "0" : "") +
            min +
            ":" +
            (sec < 10 ? "0" : "") +
            sec;
          socketRef.current.emit("meetingDuration", { duration: newTime });
          setMeetingDuration(newTime);
        }, 1000);
      } else {
        socketRef.current.on("receiving meetingDuration", (payload) => {
          setMeetingDuration(payload.duration);
        });
      }
    }
    return () => {
      clearInterval(Interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMeetingStart, meetingDuration]);

  const callUseEffect = async () => {
    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      //.getUserMedia(constraints(audioInputSelect, videoSelect))
      .then((stream) => {
        userVideo.current.srcObject = stream;
        let isAudio = true;
        let isVideo = true;
        if ("false" === getIsAudio()) {
          setIsAudio(false);
          isAudio = false;
        }
        if ("false" === getIsVideo()) {
          setIsVideo(false);
          isVideo = false;
        }
        socketRef.current.emit("join room", {
          roomID: roomID,
          userName: displayUserName,
          isAudio: isAudio,
          isVideo: isVideo,
        });

        socketRef.current.on("all users", (users) => {
          const peers = [];
        
          let isAudio = true;
          let isVideo = true;

          if ("false" === getIsAudio()) {
            isAudio = false;
            userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
          }
          if ("false" === getIsVideo()) {
            isVideo = false;
            userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
          }

          users.usersInThisRoom.forEach((userData) => {
            const peer = createPeer(
              userData.socketID,
              socketRef.current.id,
              userVideo.current.srcObject,
              displayUserName,
              isAudio,
              isVideo
            );

            peersRef.current.push({
              peerID: userData.socketID,
              peer,
              userName: userData.userName,
              isAudio: userData.isAudio,
              isVideo: userData.isVideo,
              audioVolume: false,
            });
            peers.push(peer);

            if (userData.initiator !== null)
              setMeetingInitiatorUserName(userData.initiator);
          });

          setPeers(peers);
          setConnectedCount(users.connectedUsers);
          //console.log("Meeting Start from all users socket");
          setIsMeetingStart(true);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(
            payload.signal,
            payload.callerID,
            userVideo.current.srcObject
          );

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            userName: payload.userName,
            isAudio: payload.isAudio,
            isVideo: payload.isVideo,
            audioVolume: false,
          });
          setPeers((users) => [...users, peer]);
          setConnectedCount(payload.connectedUsers);
          setIsMeetingStart(true);
          clearTimeout(alertTimeout);
       
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          setConnectedCount(payload.connectedUsers);
          try {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          } catch (error) {
            // console.log("error");
          }
        });
      })
      .catch((err) => {
        console.log("u got an error:" + err);
      });
  };

  const changesdp = (sdp) => {
    let modifier = "AS";
    let bandwidth = 4000; //kbps
    if (browserName === "firefox") {
      bandwidth = (bandwidth >>> 0) * 1000;
      modifier = "TIAS";
    }
    if (sdp.indexOf("b=" + modifier + ":") === -1) {
      // insert b= after c= line.
      sdp = sdp.replace(
        /c=IN (.*)\r\n/,
        "c=IN $1\r\nb=" + modifier + ":" + bandwidth + "\r\n"
      );
    } else {
      sdp = sdp.replace(
        new RegExp("b=" + modifier + ":.*\r\n"),
        "b=" + modifier + ":" + bandwidth + "\r\n"
      );
    }
    return sdp;
  };

  function createPeer(
    userToSignal,
    callerID,
    stream,
    userName,
    isAudio,
    isVideo
  ) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
      offerOptions: {},
      answerOptions: {},
      sdpTransform: function (sdp) {
        return changesdp(sdp);
      },
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
        userName,
        isAudio,
        isVideo,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        ],
      },
      offerOptions: {},
      answerOptions: {},
      sdpTransform: function (sdp) {
        return changesdp(sdp);
      },
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", {
        signal,
        callerID,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleAudio = (value) => {
    socketRef.current.emit("toggleAudio", {
      isAudio: value,
    });
    userVideo.current.srcObject.getAudioTracks()[0].enabled = value;
    updateAudioState(true);
    setIsAudio(value);
  };

  const toggleVideo = async (value) => {
    socketRef.current.emit("toggleVideo", {
      isVideo: value,
    });
    userVideo.current.srcObject.getVideoTracks()[0].enabled = value;
    updateVideoState(true);
    setIsVideo(value);
  };

  const disconnectCall = () => {
    peers.map((peer, index) => {
      return peer.destroy();
    });

    socketRef.current.emit("disconnectcall", {
      isAdmin: isAdmin,
      userName: displayUserName,
    });

    navigate(`/`, { replace: true });
    window.location.reload();
  };

  return (
    <div className="callpage-container">
      {isGreenRoomSet ? (
        <>
          <div className="video-grid-container">
            <div className="video-container">
              <div className="Dish" ref={dishRef}>
                <div className="div-video">
                  {isVideo ? null : (
                    <StyledDiv width={Videowidth} height={Videoheight}>
                      <div className="circle">
                        <span>{displayUserName.slice(0, 1)}</span>
                      </div>
                    </StyledDiv>
                  )}

                  <video
                    ref={userVideo}
                    className="video"
                    width={Videowidth}
                    height={Videoheight}
                    autoPlay
                    playsInline
                    muted="true"
                  />
                  <span className="participant-name">me</span>
                  <div className={`icon-block ${!isAudio ? "red-bg" : null}`}>
                    <FontAwesomeIcon
                      className="icon"
                      icon={isAudio ? faMicrophone : faMicrophoneSlash}
                    />
                  </div>
                </div>
                {peers.map((peer, index) => {
                  try {
                    const item = peersRef.current.find((p) => p.peer === peer);
                    return (
                      <Video
                        key={index}
                        peer={peer}
                        width={Videowidth}
                        height={Videoheight}
                        isVideo={item.isVideo}
                        isAudio={item.isAudio}
                        userName={item.userName}
                        audioVolume={item.audioVolume}
                      />
                    );
                  } catch (error) {
                    console.log("Video Error = " + error);
                  }
                })}
              </div>
            </div>
          </div>
          {callPageHeader && (
            <CallPageHeader
              meetingDuration={meetingDuration}
            />
          )}
          {callPageFooter && (
            <CallPageFooter
              isAudio={isAudio}
              isVideo={isVideo}
              toggleAudio={toggleAudio}
              toggleVideo={toggleVideo}
              disconnectCall={disconnectCall}
              meetInfoPopup={meetInfoPopup}
              setMeetInfoPopup={setMeetInfoPopup}
            />
          )}
          {meetInfoPopup && (
            <MeetingInfo
              setMeetInfoPopup={setMeetInfoPopup}
              url={url}
            />
          )}
        </>
      ) : (
        <GreenRoom
          userVideo={userVideo}
          audioInput={audioInput}
          setAudioInputs={setAudioInputs}
          audioOutput={audioOutput}
          setAudioOutputs={setAudioOutputs}
          videoSource={videoSource}
          setVideoSource={setVideoSource}
          audioInputSelect={audioInputSelect}
          setaudioInputSelect={setaudioInputSelect}
          audioOutputSelect={audioOutputSelect}
          setaudioOutputSelect={setaudioOutputSelect}
          videoSelect={videoSelect}
          setvideoSelect={setvideoSelect}
          setGreenRoomSettings={setGreenRoomSettings}
          isAdmin={isAdmin}
          displayUserName={displayUserName}
          displayEmail={displayEmail}
          setDisplayUsername={setDisplayUsername}
          setDisplayEmail={setDisplayEmail}
        />
      )}
    </div>
  );
};
export default MainCallScreen;
