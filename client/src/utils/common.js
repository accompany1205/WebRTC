export const getUser = () => {
  const userStr = sessionStorage.getItem("username");
  if (userStr) return userStr;
  else return null;
};
export const getDisplayUserName = () => {
  const userStr = sessionStorage.getItem("guestUserName");
  if (userStr) return userStr;
  else return null;
};
export const getDisplayEmail = () => {
  const userStr = sessionStorage.getItem("guestEmail");
  if (userStr) return userStr;
  else return null;
};
export const setDisplayUserDetails = (guestName, guestEmail) => {
  sessionStorage.setItem("guestUserName", guestName);
  sessionStorage.setItem("guestEmail", guestEmail);
};

export const getUserId = () => {
  return sessionStorage.getItem("userid") || null;
};

export const timeout = (delay) => {
  return new Promise((res) => setTimeout(res, delay));
};

export const formatMeetingContent = (url, userName) => {
  const userStr =
    userName +
    " is inviting you to join a meeting. Join the meeting from: " +
    url;

  if (userStr) return userStr;
  else return null;
};


