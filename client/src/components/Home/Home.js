import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";
import "./scss/Home.scss";
import { useEffect, useState } from "react";
import {
  rootURL,
} from "../../utils/constants";

const Home = () => {

  const navigate = useNavigate();
  const [url, setURL] = useState(null);
  const [URLerror, setURLError] = useState(null);

  const startCall = async () => {
    const roomID = shortid.generate();
    navigate(`/${roomID}#init`, { replace: true });
  };

  const joinMeeting = () => {
    let inputString = url.substring(0, 5);
    if (inputString === "http:" || inputString === "https") {
      window.location.href = url;
    } else {
      window.location.href = rootURL + url;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo">VIDEO MEET</div>
      </div>
      <div className="body">
        <div className="left-side">
          <div className="content">
            <h2>Premium video meetings</h2>
            <h2>Now free for everyone</h2>
            <p>
              We re-engineered the service we built for secure business
              meetings, Fyrlux Meet, to make it free and available for all.
            </p>

            <div className="action-btn">
              <button className="btn green" onClick={startCall}>
                <FontAwesomeIcon className="icon-block" icon={faVideo} />
                New Meeting
              </button>

              <div className="input-block">
                <div className="input-section">
                  <FontAwesomeIcon className="icon-block" icon={faKeyboard} />
                  <label htmlFor="" className={url && "filled"}>
                    Enter a code or link
                  </label>
                  <input onChange={(e) => setURL(e.target.value)} />
                </div>
                <button
                  className="btn no-bg"
                  onClick={() => {
                    if (url !== null) joinMeeting();
                    else setURLError("please enter a valid code or link");
                  }}
                >
                  Join
                </button>
              </div>
            </div>
            <div className="error-info-block">
              {URLerror && <span className="error-info">{URLerror}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
