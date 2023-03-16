import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faExclamationCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import "./scss/Header.scss";

const Header = ({ signin }) => {
  return (
    <div className="header">
     <div className="logo">FYRLUX MEET</div>
      <div className="action-btn">
        <button
          className="btn green"
          onClick={() => {
            signin();
          }}
        >
          Sign in
        </button>
        <FontAwesomeIcon className="icon-block" icon={faQuestionCircle} />
        <FontAwesomeIcon className="icon-block" icon={faExclamationCircle} />
        <FontAwesomeIcon className="icon-block" icon={faCog} />
      </div>
    </div>
  );
};

export default Header;
