import { useEffect, useRef, useState } from "react";
import "./scss/GreenRoom.scss";
import { setDisplayUserDetails } from "../../../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faMicrophone,
  faMicrophoneSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { constraints } from "../MainCallScreen/constraints";
import { setAudio, setVideo } from "./greenroomSettings";
import StyledVideo from "../MainCallScreen/styledVideo";
import StyledDiv from "../MainCallScreen/styledDiv";
import { checkMinLengthOfField, validateEmail } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";

const GreenRoom = ({
  audioInput,
  setAudioInputs,
  audioOutput,
  setAudioOutputs,
  videoSource,
  setVideoSource,
  audioInputSelect,
  setaudioInputSelect,
  audioOutputSelect,
  setaudioOutputSelect,
  videoSelect,
  setvideoSelect,
  setGreenRoomSettings,
  isAdmin,
  displayUserName,
  displayEmail,
  setDisplayUsername,
  setDisplayEmail,
}) => {
  const navigate = useNavigate();
  const userVideo = useRef();
  const [displayUsernameError, setDisplayUsernameError] = useState("");
  const [displayEmailError, setDisplayEmailError] = useState("");
  const [Videoheight, setVideoheight] = useState("100%");
  const [Videowidth, setVideowidth] = useState("100%");
  const [mediaPermissionsError, setMediaPermisstionsError] = useState("");
  const [audioOutputError, setaudioOutputError] = useState("");
  const [isErrorDialog, setErrorDialog] = useState(false);
  const [isAudioOutputErrorDialog, setAudioOutputErrorDialog] = useState(false);
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);

  const updatedDevices = async (deviceInfos) => {
    let aI = [];
    let aO = [];
    let vsource = [];
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === "audioinput") {
        aI.push({
          label: deviceInfo.label,
          deviceId: deviceInfo.deviceId,
        });
      } else if (deviceInfo.kind === "audiooutput") {
        aO.push({
          label: deviceInfo.label,
          deviceId: deviceInfo.deviceId,
        });
      } else if (deviceInfo.kind === "videoinput") {
        vsource.push({
          label: deviceInfo.label,
          deviceId: deviceInfo.deviceId,
        });
      } else {
        console.log("Some other kind of source/device: ", deviceInfo);
      }
    }
    setAudioInputs(aI);
    setAudioOutputs(aO);
    setVideoSource(vsource);
    console.log("videoSource : " + JSON.stringify(vsource));
  };

  const setaudioInput = (value) => {
    setaudioInputSelect(value);
    console.log("audioInputSelect:= " + value);
    openMediaDevice();
  };

  const setaudioOutput = (value) => {
    setaudioOutputSelect(value);
    console.log("audioOutputSelect:= " + value);
    changeAudioDestination();
  };

  const setvideo = (value) => {
    console.log("videoSelect:= " + value);
    setvideoSelect(value);
    openMediaDevice();
  };

  const getConnectedDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    await updatedDevices(devices);
    return devices;
  };

  const gotStream = (stream) => {
    userVideo.current.srcObject = stream;
    return getConnectedDevices();
  };

  const attachSinkId = (element, sinkId) => {
    if (typeof element.sinkId !== "undefined") {
      element
        .setSinkId(sinkId)
        .then(() => {
          setaudioOutputError("");
          setAudioOutputErrorDialog(false);
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch((error) => {
          let errorMessage = error;
          if (error.name === "SecurityError") {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error("audioOutput Error: " + errorMessage);
          // Jump back to first output device in the list as it's the default.
          setaudioOutputError("" + errorMessage);
          setAudioOutputErrorDialog(true);
          setaudioOutputSelect("");
        });
    } else {
      console.warn("Browser does not support output device selection.");
      setaudioOutputError("Browser does not support output device selection.");
      setAudioOutputErrorDialog(true);
    }
  };

  const changeAudioDestination = () => {
    attachSinkId(userVideo.current, audioOutputSelect);
  };

  const openMediaDevice = async () => {
    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      //.getUserMedia(constraints(audioInputSelect, videoSelect))
      .then((stream) => {
        console.log(stream.getVideoTracks()[0].getSettings().frameRate);
        gotStream(stream);
      })
      .catch((err) => {
        console.log("u got an error:" + err);
        setMediaPermisstionsError("" + err);
        setErrorDialog(true);
      });
  };

  useEffect(() => {
    openMediaDevice();
    // Listen for changes to media devices and update the list accordingly
    navigator.mediaDevices.addEventListener("devicechange", (event) => {
      openMediaDevice();
    });
  }, []);

  return (
    <div className="green-room-container">
      <div className="left-side">
        <div
          className="header"
          onClick={() => {
            navigate("/", { replace: true });
            window.location.reload();
          }}
        >
          FYRLUX MEET
        </div>
        <div className="signin-block">
          {isErrorDialog ? (
            <div className="error-info">{mediaPermissionsError}</div>
          ) : null}
        </div>
        <div className="div-video">
          {isVideo ? null : (
            <StyledDiv width={Videowidth} height={Videoheight}>
              <div className="circle">
                {displayUserName ? (
                  <span>{displayUserName.slice(0, 1)}</span>
                ) : null}
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
          {/*<StyledVideo
            muted
            ref={userVideo}
            autoPlay
            playsInline
            width={Videowidth}
            height={Videoheight}
          />*/}
          <span className="participant-name">{displayUserName}</span>
          <div className={`icon-block ${!isAudio ? "red-bg" : null}`}>
            <FontAwesomeIcon
              className="icon"
              icon={isAudio ? faMicrophone : faMicrophoneSlash}
            />
          </div>
        </div>

        <div className="title">Video</div>

        <div className="input-section">
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={(e) => setIsVideo(!isVideo)}
          />
          Start without video
        </div>
        <div className="input-section">
          <select
            className="dropdown-menu"
            onChange={(e) => {
              setvideo(e.target.value);
            }}
          >
            {videoSource.map((items) => {
              return <option value={items.deviceId}>{items.label}</option>;
            })}
          </select>
        </div>
        <div className="divider"></div>
        <div className="title">Audio</div>
        <div className="input-section">
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={(e) => setIsAudio(!isAudio)}
          />
          Start with muted audio
        </div>
        <div className="input-section">
          <span className="sub-title">Audio Input:</span>
          <select
            className="dropdown-menu"
            onChange={(e) => {
              setaudioInput(e.target.value);
            }}
          >
            {audioInput.map((items) => {
              if (items.label !== "")
                return <option value={items.deviceId}>{items.label}</option>;
            })}
          </select>
        </div>

        <div className="input-section">
          <div className="signin-block">
            {isAudioOutputErrorDialog ? (
              <div className="error-info">{audioOutputError}</div>
            ) : null}
          </div>
          <span className="sub-title">Audio Output:</span>

          <select
            className="dropdown-menu"
            onChange={(e) => {
              setaudioOutput(e.target.value);
            }}
          >
            {audioOutput.map((items) => {
              return <option value={items.deviceId}>{items.label}</option>;
            })}
          </select>
        </div>

        <div className="divider"></div>
      </div>
      <div className="right-side">
        <div className="signin-block">
          <div className="input-block">
            <div className="input-section">
              <FontAwesomeIcon className="icon-block" icon={faUser} />
              <label htmlFor="" className={displayUserName && "filled"}>
                Display Name
              </label>
              <input
                type="text"
                value={displayUserName}
                onChange={(e) => setDisplayUsername(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="field-error-block">
          {displayUsernameError && (
            <label className="error-field">{displayUsernameError}</label>
          )}
        </div>
        <div className="signin-block">
          <div className="input-block">
            <div className="input-section">
              <FontAwesomeIcon className="icon-block" icon={faEnvelope} />
              <label htmlFor="" className={displayEmail && "filled"}>
                Email Address
              </label>
              <input
                type="text"
                value={displayEmail}
                onChange={(e) => setDisplayEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="field-error-block">
          {displayEmailError && (
            <label className="error-field">{displayEmailError}</label>
          )}
        </div>
        <div className="divider"></div>

        <div className="signin-block">
          {isErrorDialog ? null : (
            <button
              className="btn"
              onClick={() => {
                if (checkMinLengthOfField(displayUserName)) {
                  setDisplayUsernameError("Minimum 3 characters required");
                } else if (!validateEmail(displayEmail)) {
                  setDisplayEmailError("Invalid email-id");
                } else {
                  setDisplayUserDetails(displayUserName, displayEmail);
                  setAudio(isAudio);
                  setVideo(isVideo);
                  userVideo.current.srcObject.getVideoTracks()[0].stop();
                  userVideo.current.srcObject.getAudioTracks()[0].stop();
                  setGreenRoomSettings(true);
                }
              }}
            >
              {isAdmin ? "START MEETING" : "JOIN MEETING"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default GreenRoom;
