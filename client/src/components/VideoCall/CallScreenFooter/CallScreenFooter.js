import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMicrophone,
  faPhone,
  faAngleUp,
  faMicrophoneSlash,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import "./scss/CallScreenFooter.scss";

const CallPageFooter = ({
  isAudio,
  isVideo,
  toggleAudio,
  toggleVideo,
  disconnectCall,
  meetInfoPopup,
  setMeetInfoPopup,
}) => {
  return (
    <div className="footer-item">
      <div className="left-item">
        <div
          className="icon-block"
          onClick={() => {
            setMeetInfoPopup(!meetInfoPopup);
          }}
        >
          Meeting details
          <FontAwesomeIcon className="icon" icon={faAngleUp} />
        </div>
      </div>

      <div className="center-item">
        <div
          className={`icon-block ${!isAudio ? "red-bg" : null}`}
          onClick={() => toggleAudio(!isAudio)}
        >
          <FontAwesomeIcon
            className="icon"
            icon={isAudio ? faMicrophone : faMicrophoneSlash}
          />
        </div>
        <div className="icon-block" onClick={disconnectCall}>
          <FontAwesomeIcon className="icon red" icon={faPhone} />
        </div>
        <div
          className={`icon-block ${!isVideo ? "red-bg" : null}`}
          onClick={() => toggleVideo(!isVideo)}
        >
          <FontAwesomeIcon
            className="icon"
            icon={isVideo ? faVideo : faVideoSlash}
          />
        </div>
      </div>
      <div className="right-item">
        <div className="icon-block"></div>
      </div>
    </div>
  );
};

export default CallPageFooter;
