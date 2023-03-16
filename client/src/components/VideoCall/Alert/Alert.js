import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt,  faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./scss/Alert.scss";

const Alert = ({ messageAlert }) => {
  return (
    <div className="message-alert-popup">
      {messageAlert.payload.user ? (
        <div className="alert-header">
          <FontAwesomeIcon className="icon" icon={faCommentAlt} />
          <h3>{messageAlert.payload.user}</h3>
        </div>
      ) : (
        <div className="alert-header">
          <FontAwesomeIcon className="icon" icon={faInfoCircle} />
          <h3>Alert</h3>
        </div>
      )}

      <p className="alert-msg">{messageAlert.payload.msg}</p>
    </div>
  );
};

export default Alert;
