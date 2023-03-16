const resizeParticipantsList = (
  connectedCount,
  setVideoheight,
  setVideowidth,
  dishRef
) => {
  let _height = null;
  let _width = null;
  let _margin = 5;
  let _padding = 200;
  let _ratios = ["4:3", "16:9", "1:1", "1:2"];
  let _aspect = 0;
  const ratio = () => {
    var ratio = _ratios[_aspect].split(":");
    return ratio[1] / ratio[0];
  };
  let _ratio = ratio();

  // calculate dimensions
  const dimensions = () => {
    _width = window.innerWidth - _margin * 2;
    _height = window.innerHeight - _padding;
  };

  const newarea = (increment) => {
    let i = 0;
    let w = 0;
    let h = increment * _ratio + _margin * 2;
    while (i < connectedCount) {
      if (w + increment > _width) {
        w = 0;
        h = h + increment * _ratio + _margin * 2;
      }
      w = w + increment + _margin * 2;
      i++;
    }
    if (h > _height || increment > _width) return false;
    else return increment;
  };

  const resizer = (width) => {
    //setVideoheight(width * _ratio + "px");
    //setVideowidth(width + "px");
    for (var s = 0; s < dishRef.current.children.length; s++) {
      // camera fron dish (div without class)
      let element = dishRef.current.children[s];

      // custom margin
      element.style.margin = _margin + "px";

      // calculate dimensions
      element.style.width = width + "px";
      element.style.height = width * _ratio + "px";

      // to show the aspect ratio in demo (optional)
      element.setAttribute("data-aspect", _ratios[_aspect]);
    }
  };

  const resize = () => {
    // get dimensions of dish
    dimensions();

    // loop (i recommend you optimize this)
    let max = 0;
    let i = 1;
    while (i < 5000) {
      let area = newarea(i);
      if (area === false) {
        max = i - 1;
        break;
      }
      i++;
    }

    // remove margins
    max = max - _margin * 2;

    // set dimensions to all cameras
    resizer(max);
  };

  resize();
};

export default resizeParticipantsList;
