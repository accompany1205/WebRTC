export const getGreenRoomIsVideo = () => {
  const userStr = sessionStorage.getItem("isVideo");
  return userStr;
};
export const getGreenRoomIsAudio = () => {
  const userStr = sessionStorage.getItem("isAudio");
  return userStr;
};
export const getGreenRoomIsMeetingPrivate = () => {
  const userStr = sessionStorage.getItem("isMeetingPrivate");
  return userStr;
};
export const setGreenRoomSettings = (isVideo, isAudio, isMeetingPrivate) => {
  sessionStorage.setItem("isVideo", isVideo);
  sessionStorage.setItem("isAudio", isAudio);
  sessionStorage.setItem("isMeetingPrivate", isMeetingPrivate);
};
export const isChatMsgSound = () => {
  const chatMsgSound = sessionStorage.getItem("chatMsgSound");
  return chatMsgSound;
};
export const setChatMsgSound = (value) => {
  sessionStorage.setItem("chatMsgSound", value);
};
export const isParticipantJoinSound = () => {
  const chatMsgSound = sessionStorage.getItem("ParticipantJoin");
  return chatMsgSound;
};
export const setParticipantJoinSound = (value) => {
  sessionStorage.setItem("ParticipantJoin", value);
};
export const isParticipantLeaveSound = () => {
  const chatMsgSound = sessionStorage.getItem("ParticipantLeave");
  return chatMsgSound;
};
export const setParticipantLeaveSound = (value) => {
  sessionStorage.setItem("ParticipantLeave", value);
};
export const isChatNotification = () => {
  const chatNotification = sessionStorage.getItem("chatNotification");
  return chatNotification;
};
export const setChatNotification = (value) => {
  sessionStorage.setItem("chatNotification", value);
};
export const isJoinNotification = () => {
  const joinNotification = sessionStorage.getItem("joinNotification");
  return joinNotification;
};
export const setJoinNotification = (value) => {
  sessionStorage.setItem("joinNotification", value);
};
export const isLeaveNotification = () => {
  const leaveNotification = sessionStorage.getItem("leaveNotification");
  return leaveNotification;
};
export const setLeaveNotification = (value) => {
  sessionStorage.setItem("leaveNotification", value);
};
export const getIsAudio = () => {
  const audio = sessionStorage.getItem("isAudio");
  return audio;
};
export const setAudio = (value) => {
  sessionStorage.setItem("isAudio", value);
};
export const getIsVideo = () => {
  const video = sessionStorage.getItem("isVideo");
  return video;
};
export const setVideo = (value) => {
  sessionStorage.setItem("isVideo", value);
};