import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./scss/CallScreenHeader.scss";
import { formatDate } from "../../../utils/helpers";


const CallPageHeader = ({
  meetingDuration,
}) => {
  let interval = null;
  
  const [currentTime, setCurrentTime] = useState(() => {
    return formatDate();
  });
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    interval = setInterval(() => setCurrentTime(formatDate()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="frame-header">
      <div className="header-items time-block">{meetingDuration}</div>
      <div className="header-items date-block">{currentTime}</div>
      <div className="header-items icon-block">
      <FontAwesomeIcon className="icon profile" icon={faUserCircle} />
      </div>
    </div>
  );
};

export default CallPageHeader;
