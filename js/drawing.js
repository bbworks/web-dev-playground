(function() {
  //Set up public functions
  window.drawing = {};

  //Set up the canvas and context
  const drawingCanvas = document.getElementById("drawing-canvas");
  const drawingCanvasContext = drawingCanvas.getContext("2d");
  drawingCanvas.width = 500;
  drawingCanvas.height = drawingCanvas.width/2;
  drawingCanvasContext.fillStyle = "black";

  const drawingMenu = document.getElementById("drawing-interface-menu");
  const drawingInstructions = document.getElementById("drawing-instructions-overlay");
  const drawingSizeInput = document.getElementById("drawing-size-input");
  const drawingSizeCircle = document.getElementById("drawing-size-circle");
  const colorPickerCanvas = document.getElementById("color-picker-canvas");
  const colorPickerDisplay = document.getElementById("color-picker-display");
  const drawingMenuTouchButton = document.getElementById("drawing-interface-menu-touch-button");

  const drawingMenuOpenClassName = "open";

  let points = [];
  let undos = [];
  let touch;
  let drawingMouseDown = false;
  let colorPickerMouseDown = false;
  let colorPickerColorSelector;

  const totalNumberOfColors = 1536;
  const numberOfColorSequences = 6;
  const colorSequenceLength = totalNumberOfColors/numberOfColorSequences;

  //Let's make a standard for our events
  const EVENT_TYPE = {
    down: 0,
    up: 1,
  };

  const MOUSE_BUTTON_COLOR = {
    0: "primary", //left
    2: "secondary", //right
  };

  const penColor = {
    primary: {
      color: "black",
      element: document.getElementById("drawing-color-primary"),
    },
    secondary: {
      color: "white",
      element: document.getElementById("drawing-color-secondary"),
    },
  };

  const getEventDownUp = function(event) {
    if (event.type === "mousedown" || event.type === "touchstart") {
      return 0;
    }
    else if (event.type === "mouseup" || event.type === "touchend") {
      return 1;
    }
  };

  //Create a reusable way to return the mouse/touch x y point
  const getMouseOrTouch = function(event) {
    if (event.type.match("mouse")) {
      return "mouse";
    }
    else if (event.type.match("touch")) {
      return "touch";
    }
    return false;
  };

  //Let's create some mouse/touch helper functions
  const getOffsetXY = function(event, canvas) {
    const mouseOrTouch = getMouseOrTouch(event);
    const canvasRect = canvas.getBoundingClientRect();
    return {
      x: (mouseOrTouch === "mouse" ? event.offsetX : (mouseOrTouch === "touch" ? event.touches[0].clientX - canvasRect.x : null)),
      y: (mouseOrTouch === "mouse" ? event.offsetY : (mouseOrTouch === "touch" ? event.touches[0].clientY - canvasRect.y : null)),
    }
  };

  const getPageXY = function(event) {
    const mouseOrTouch = getMouseOrTouch(event);
    return {
      x: (mouseOrTouch === "mouse" ? event.pageX : (mouseOrTouch === "touch" ? event.touches[0].pageX : null)),
      y: (mouseOrTouch === "mouse" ? event.pageY : (mouseOrTouch === "touch" ? event.touches[0].pageY : null)),
    }
  };

  //Set up a listener for the pen down and up
  const handleDrawingOnMouseDownUp = function(event) {
    //Don't do anything unless we're touching our canvas
    if (event.srcElement === drawingCanvas) {
      //IF we're putting the pen down, set our starting point
      if (getEventDownUp(event) === EVENT_TYPE.down) {
        drawingMouseDown = true;
        const point = getOffsetXY(event, drawingCanvas);

        drawingCanvasContext.beginPath();
        drawingCanvasContext.strokeStyle = penColor[MOUSE_BUTTON_COLOR[event.button]].color;
        drawingCanvasContext.moveTo(point.x, point.y);
        touch = points.length;
        points[touch] = {
          metadata: {
            initialPoint: [point.x, point.y],
            color: drawingCanvasContext.strokeStyle,
            width: drawingCanvasContext.lineWidth,
          },
          points: [],
        };
        undos = [];
      }
      else if (getEventDownUp(event) === EVENT_TYPE.up) {
        drawingMouseDown = false;
        checkButtonDisable("drawing-undo");
        checkButtonDisable("drawing-redo");
      }

      //Either add or remove the pen drawing listener, depending on the pen coming down or up
      const func = (getEventDownUp(event) === EVENT_TYPE.down ? "add" : (getEventDownUp(event) === EVENT_TYPE.up ? "remove" : null));
      window[func+"EventListener"](getMouseOrTouch(event)+"move", handleDrawingOnMouseMove);
    }
  };

  //Set up a listener for the pen moving while down
  const handleDrawingOnMouseMove = function(event) {
    const point = getOffsetXY(event, drawingCanvas);
    points[touch].points.push([point.x, point.y]);
    drawingCanvasContext.lineTo(point.x, point.y);
    drawingCanvasContext.stroke();
  };

  //Slide menu open if our mouse is depressed and in the top 10 pixels of our canvas
  const handleMenuOpenOnMouseMove = function(event) {
    let hideInstructions = true;
    const openMenu = function() {
      drawingMenu.classList.add(drawingMenuOpenClassName);
      if (hideInstructions) {
        drawingInstructions.style.opacity = 0;
        window.setTimeout(()=>{drawingInstructions.style.display = "none";}, 1000);
        hideInstruction = false;
      }
    };
    const closeMenu = function() {
      drawingMenu.classList.remove(drawingMenuOpenClassName);
    };

    event.preventDefault();

    if (event.type === "click" && event.srcElement === drawingMenuTouchButton) {
      if (!drawingMenu.classList.contains(drawingMenuOpenClassName)) {
        openMenu();
      } else {
        closeMenu();
      }
    }
    else {
      const drawingCanvasRect = drawingCanvas.getBoundingClientRect();
      const isWithinBoundary = (
        (event.clientY >= drawingCanvasRect.y) &&
        (event.clientX >= drawingCanvasRect.x) &&
        (event.clientY <= drawingCanvasRect.y + 10) &&
        (event.clientX <= drawingCanvasRect.x + drawingCanvasRect.width)
      );
      if (!drawingMouseDown && isWithinBoundary && !drawingMenu.classList.contains(drawingMenuOpenClassName)) {
        openMenu();
      }
      else if (!isWithinBoundary && drawingMenu.classList.contains(drawingMenuOpenClassName) && !event.srcElement.classList.contains("drawing-interface-menu-keep-open")) {
        closeMenu();
      }
    }
  };

  const checkButtonDisable = function(className) {
    const button = document.getElementById(className);
    const disabledClassName = "drawing-interface-menu-button-disabled";
    let func;
    switch (className) {
      case "drawing-undo": {
        func = (points.length > 0 ? "remove" : "add");
        break;
      }
      case "drawing-redo": {
        func = (undos.length > 0 ? "remove" : "add");
        break;
      }
    }
    button.classList[func](disabledClassName);
  };

  const handleOnInput = function(event) {
    const value = drawingSizeInput.value;
    const minSize = 1; //px
    const maxSize = 16; //px
    const size = (maxSize-minSize) * (value/100) + minSize;
    drawingSizeCircle.style.width = size + "px";
    drawingSizeCircle.style.height = size + "px";
    drawingCanvasContext.beginPath();
    drawingCanvasContext.lineWidth = size;
  }.bind(this);

  const getColorFromValue = function(value) {
    const colorCodes = {
      red: [255,-1,0,0,1,255],
      green: [0,0,1,255,255,-1],
      blue: [1,255,255,-1,0,0],
    };
    let colorSequenceNumber = Math.floor(value/colorSequenceLength);
    let modulus = value%colorSequenceLength;
    const color = {
      red: null,
      green: null,
      blue: null,
    };
    for (let colorName in color) {
      const colorValue = colorCodes[colorName][colorSequenceNumber];
      color[colorName] = (
        colorValue === 255 ? 255 : (
          colorValue === 0 ? 0 : (
            Math.abs((modulus + (256 * colorValue)) % 256)
          )
        )
      );
    }
    return `rgb(${color.red},${color.green},${color.blue})`;
  };

  const initializeColorPickerCanvas = function() {
    const colorPickerContext = colorPickerCanvas.getContext("2d");

    //Loop through, creating each color
    for (let i = 0; i < totalNumberOfColors; i++) {
      const color = getColorFromValue(i);
      colorPickerContext.beginPath();
      colorPickerContext.moveTo(i, 0);
      colorPickerContext.lineTo(i, 100);
      colorPickerContext.strokeStyle = color;
      colorPickerContext.stroke();
    }
  };

  const handleColorPickerCanvasOnMouseDownUp = function(event) {
    event.preventDefault();

    if (getEventDownUp(event) === EVENT_TYPE.down) {
      colorPickerMouseDown = true;
      colorPickerColorSelector = MOUSE_BUTTON_COLOR[event.button];
    }
    else if (getEventDownUp(event) === EVENT_TYPE.up) {
      colorPickerMouseDown = false;
    }

    if (colorPickerMouseDown) {
      //Display the color picker display with the
      // correct color, in the correct position
      const colorPickerCanvasWidth = colorPickerCanvas.getBoundingClientRect().width;
      const x = getOffsetXY(event, colorPickerCanvas).x;
      const value = Math.floor((x < 0 ? 0 : (x > totalNumberOfColors ? totalNumberOfColors : x)) / colorPickerCanvasWidth * totalNumberOfColors);
      const color = getColorFromValue(value);
      const colorPickerDisplayOffset = (getMouseOrTouch(event) === "mouse" ? 5 : 20); //px
      penColor[colorPickerColorSelector].color = color;

      penColor[colorPickerColorSelector].element.style.color = color;
      drawingSizeCircle.style.backgroundColor = color;
      colorPickerDisplay.style.backgroundColor = color;
      colorPickerDisplay.style.display = "block";
      colorPickerDisplay.style.top = getPageXY(event).y-colorPickerDisplayOffset+"px";
      colorPickerDisplay.style.left = getPageXY(event).x+colorPickerDisplayOffset+"px";
    }
    else {
      colorPickerDisplay.style.display = "none";
    }
  };

  const checkIsTouchable = function() {
    try {
	    document.createEvent("TouchEvent");
	    return true;
	  } catch (exception) {
	    return false;
	  }
  };

  const isTouchableInit = function() {
    drawingMenuTouchButton.style.display = "block";
    document.getElementById("drawing-instructions-mouse").style.display = "none";
    document.getElementById("drawing-instructions-touch").style.display = "block";
  };

  const handleOnResize = function(event) {
    let height;
    if (window.matchMedia("(min-width: 1200px)").matches) {
      height = 1000;
    }
    else if (window.matchMedia("(min-width: 768px)").matches) {
      height = 700;
    }
    else if (window.matchMedia("(min-width: 600px)").matches) {
      height = 500;
    }
    else {
      height = 300;
    }

    drawingCanvas.width = height;
    drawingCanvas.height = height/2;
  };

  window.drawing.undo = function() {
    const metadataSave = {
      color: drawingCanvasContext.strokeStyle,
      width: drawingCanvasContext.lineWidth,
    };

    if (points.length) {
      //clear our canvas and redraw all but the last touch
      undos.push(points.pop());
      drawingCanvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

      for (let i = 0; i < points.length; i++) {
        let touch = points[i];
        drawingCanvasContext.beginPath();
        drawingCanvasContext.moveTo(touch.metadata.initialPoint[0], touch.metadata.initialPoint[1]);
        drawingCanvasContext.strokeStyle = touch.metadata.color;
        drawingCanvasContext.lineWidth = touch.metadata.width;
        for (let j = 0; j < touch.points.length; j++) {
          drawingCanvasContext.lineTo(touch.points[j][0], touch.points[j][1]);
          drawingCanvasContext.stroke();
        }
      }

      //Set the context back to where we were
      drawingCanvasContext.beginPath();
      drawingCanvasContext.strokeStyle = metadataSave.color;
      drawingCanvasContext.lineWidth = metadataSave.width;
    }
    checkButtonDisable("drawing-undo");
    checkButtonDisable("drawing-redo");
  }

  window.drawing.redo = function() {
    const metadataSave = {
      color: drawingCanvasContext.strokeStyle,
      width: drawingCanvasContext.lineWidth,
    };

    if (undos.length) {
      //Let's redraw the last undo
      const popped = undos.pop();
      points.push(popped);
      drawingCanvasContext.beginPath();

      drawingCanvasContext.moveTo(popped.metadata.initialPoint[0], popped.metadata.initialPoint[1]);
      drawingCanvasContext.strokeStyle = popped.metadata.color;
      drawingCanvasContext.lineWidth = popped.metadata.width;
      for (let i = 0; i < popped.points.length; i++) {
        drawingCanvasContext.lineTo(popped.points[i][0], popped.points[i][1]);
        drawingCanvasContext.stroke();
      }

      //Set the context back to where we were
      drawingCanvasContext.beginPath();
      drawingCanvasContext.strokeStyle = metadataSave.color;
      drawingCanvasContext.lineWidth = metadataSave.width;
    }
    checkButtonDisable("drawing-undo");
    checkButtonDisable("drawing-redo");
  }

  window.drawing.clear = function() {
    drawingCanvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingCanvasContext.beginPath();
    points = [];
    undos = [];
    checkButtonDisable("drawing-undo");
    checkButtonDisable("drawing-redo");
  }

  //Set our button to disabled
  checkButtonDisable("drawing-undo");
  checkButtonDisable("drawing-redo");

  //Check for touch capabilities, and adjust appropriately
  if(checkIsTouchable()) {
    isTouchableInit();
  }

  //Attach our pen down/up listeners for the drawing canvas
  drawingCanvas.addEventListener("mousedown", handleDrawingOnMouseDownUp);
  drawingCanvas.addEventListener("mouseup", handleDrawingOnMouseDownUp);
  drawingCanvas.addEventListener("mousemove", handleMenuOpenOnMouseMove);

  drawingCanvas.addEventListener("touchstart", handleDrawingOnMouseDownUp);
  drawingCanvas.addEventListener("touchend", handleDrawingOnMouseDownUp);
  drawingCanvas.addEventListener("touchmove", handleMenuOpenOnMouseMove);
  drawingMenuTouchButton.addEventListener("click", handleMenuOpenOnMouseMove);

  //Initialize components
  initializeColorPickerCanvas();

  //Attach our listeners for the menu buttons
  drawingSizeInput.addEventListener("input", handleOnInput);
  colorPickerCanvas.addEventListener("mousedown", handleColorPickerCanvasOnMouseDownUp);
  colorPickerCanvas.addEventListener("mouseup", handleColorPickerCanvasOnMouseDownUp);
  colorPickerCanvas.addEventListener("mousemove", handleColorPickerCanvasOnMouseDownUp);

  colorPickerCanvas.addEventListener("touchstart", handleColorPickerCanvasOnMouseDownUp);
  colorPickerCanvas.addEventListener("touchend", handleColorPickerCanvasOnMouseDownUp);
  colorPickerCanvas.addEventListener("touchmove", handleColorPickerCanvasOnMouseDownUp);

  //Handle resizing and orientation changing
  window.addEventListener("resize", handleOnResize);
  window.addEventListener("orientationchange", handleOnResize);
  handleOnResize();

  //Make sure we disable the context menu when
  // using the right-click on our canvases
  drawingCanvas.addEventListener("contextmenu", (event)=>{event.preventDefault();});
  colorPickerCanvas.addEventListener("contextmenu", (event)=>{event.preventDefault();});
})();
