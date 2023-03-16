import {
  faMicrophone,
  faMicrophoneSlash,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { posterImageURL } from "../../../utils/constants";
import StyledDiv from "./styledDiv";
import StyledVideo from "./styledVideo";

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="div-video">
      {props.isVideo ? null : (
        <StyledDiv
          width={props.width}
          height={props.height}
        >
          <div className="circle">
            <span>{props.userName.slice(0, 1)}</span>
          </div>
        </StyledDiv>
      )}
      <video
        ref={ref}
        className="video"
        width={props.width}
        height={props.height}
        autoPlay
        playsInline
      />

      {/*<StyledVideo
        playsInline
        autoPlay
        ref={ref}
        width={props.width}
        height={props.height}
        poster={posterImageURL}
      />*/}

      <span className="participant-name">{props.userName}</span>
      <div className={`icon-block ${!props.isAudio ? "red-bg" : null}`}>
        <FontAwesomeIcon
          className="icon"
          icon={props.isAudio ? faMicrophone : faMicrophoneSlash}
        />
      </div>
      {props.audioVolume && props.isAudio ? (
        <div className={`icon-block red-bg`}>
          <FontAwesomeIcon className="icon" icon={faVolumeUp} />
        </div>
      ) : null}
    </div>
  );
};

export default Video;
