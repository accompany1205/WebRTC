const PopupMessageAlert = (
  setMessageAlert,
  messageAlert,
  title,
  msg,
  timeoutSec,
) => {
  let alertTimeout = null;
  setMessageAlert({
    alert: true,
    isPopup: true,
    payload: {
      user: title,
      msg: msg,
    },
  });
  clearTimeout(alertTimeout);
  alertTimeout = setTimeout(() => {
    setMessageAlert({
      ...messageAlert,
      isPopup: false,
      payload: {},
    });
  }, timeoutSec);
};

export default PopupMessageAlert;
