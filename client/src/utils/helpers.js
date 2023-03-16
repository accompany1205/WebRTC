import moment from "moment";

export const formatDate = (timestamp) => {
  return moment(timestamp).format("h:mm A");
};
export const checkMinLengthOfField = (string) => {
  if (string.length < 3) {
    return true;
  } else {
    return false;
  }
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
