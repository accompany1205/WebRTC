import { getDisplayUserName } from "../../../utils/common";

export const checkValidRoomId = (
  socketRef,
  callUseEffect,
  navigate,
  
) => {
  let oldpathname = window.location.pathname;
  let newPathname = oldpathname.slice(1);
  let userName = getDisplayUserName();
  socketRef.current.emit("checkIsValidRoomID", {
    roomID: newPathname,
    userName: userName,
  });
  socketRef.current.on("roomIdStatus", (status) => {
    console.log("checkValidRoomId : " + JSON.stringify(status));
    if (status.isValid) {
      callUseEffect();
    } else {
      console.log("Meeting-ID not found");
      //userVideo.current.srcObject.getVideoTracks()[0].stop();
      
      navigate("/invalidurl", { replace: true });
      window.location.reload();
    }
  });
};
