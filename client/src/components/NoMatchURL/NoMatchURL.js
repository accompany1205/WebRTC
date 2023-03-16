import { Link, useNavigate } from "react-router-dom";
import "./scss/NoMatchURL.scss";
//import Header from "../VideoCall/Header/Header";

const NoMatch = () => {
  const navigate = useNavigate();
  return (
    <div className="no-match">
      {/*<Header />*/}
      <div className="no-match__content">
        <h2>FYRLUX MEET</h2>
        <h2>Invalid Meeting URL</h2>
        <div className="action-btn">
          <div
            className="btn green"
            onClick={() => {
              navigate("/", { replace: true });
            }}
          >
            Return to home
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoMatch;
