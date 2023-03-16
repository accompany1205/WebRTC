import styled from "styled-components";

const StyledDiv = styled.div`
  position: absolute;
  display: flex;
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  background: #00796b;
  z-index: 2;
  align-items: center;
  justify-content: center;
  .circle {
    background: lightblue;
    border-radius: 50%;
    width: 120px;
    height: 100px;
    font-weight: 600;
    font-size: 80px;
    text-align: center;
    padding-bottom: 25px;
  }
  
`;

export default StyledDiv;