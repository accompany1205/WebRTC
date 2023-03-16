import styled from "styled-components";

const StyledVideo = styled.video`
  object-fit: cover;
  position: relative;
  z-index: 1;
  right: 0;
  bottom: 0;
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  background: #000;
  overflow: hidden;
  left: 0;
  top: 0;
  background-size: cover;
  overflow: hidden;
  -webkit-transition: margin-top 1s ease-in-out;
  -moz-transition: margin-top 1s ease-in-out;
  -o-transition: margin-top 1s ease-in-out;
  transition: margin-top 1s ease-in-out;
 /* -webkit-transform: scaleX(-1);
  transform: scaleX(-1);*/
  .video.loading {
    margin-top: 100%;
  }
`;

export default StyledVideo;
