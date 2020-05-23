(function() {
  //Set up public functions
  window.drawing = {};

  //Set up the canvas and context
  const drawingCanvas = document.getElementById("drawing-canvas");
  const drawingCanvasContext = drawingCanvas.getContext("2d");
  drawingCanvas.width = 500;
  drawingCanvas.height = 200;
  drawingCanvasContext.fillStyle = "black";

  const drawingMenu = document.getElementById("drawing-interface-menu");
  const drawingInstructions = document.getElementById("drawing-instructions-overlay");
  const drawingSizeInput = document.getElementById("drawing-size-input");
  const drawingSizeCircle = document.getElementById("drawing-size-circle");
  const colorPickerCanvas = document.getElementById("color-picker-canvas");
  const colorPickerDisplay = document.getElementById("color-picker-display");

  const drawingMenuOpenClassName = "open";

  let points = [];
  let undos = [];
  let touch;
  let drawingMouseDown = false;
  let colorPickerMouseDown = false;

  const totalNumberOfColors = 1536;
  const numberOfColorSequences = 6;
  const colorSequenceLength = totalNumberOfColors/numberOfColorSequences;

  //Set up a listener for the pen down and up
  const handleDrawingOnMouseDownUp = function(event) {
    //Don't do anything unless we're touching our canvas
    if (event.srcElement === drawingCanvas) {
      //IF we're putting the pen down, set our starting point
      if (event.type === "mousedown") {
        drawingMouseDown = true;
        const x = event.offsetX;
        const y = event.offsetY;

        drawingCanvasContext.beginPath();
        drawingCanvasContext.moveTo(x, y);
        touch = points.length;
        points[touch] = {
          metadata: {
            initialPoint: [x, y],
            color: drawingCanvasContext.strokeStyle,
            width: drawingCanvasContext.lineWidth,
          },
          points: [],
        };
        undos = [];
      }
      else {
        drawingMouseDown = false;
        checkButtonDisable("drawing-undo");
        checkButtonDisable("drawing-redo");
      }

      //Either add or remove the pen drawing listener, depending on the pen coming down or up
      const func = (event.type === "mousedown" ? "add" : (event.type === "mouseup" ? "remove" : null));
      window[func+"EventListener"]("mousemove", handleDrawingOnMouseMove);
    }
  };

  //Set up a listener for the pen moving while down
  const handleDrawingOnMouseMove = function(event) {
    const x = event.offsetX;
    const y = event.offsetY;

    points[touch].points.push([x, y]);
    drawingCanvasContext.lineTo(x, y);
    drawingCanvasContext.stroke();
  };

  //Slide menu open if our mouse is depressed and in the top 10 pixels of our canvas
  const handleMenuOpenOnMouseMove = function(event) {
    const drawingCanvasRect = drawingCanvas.getBoundingClientRect();
    const isWithinBoundary = (
      (event.clientY >= drawingCanvasRect.y) &&
      (event.clientX >= drawingCanvasRect.x) &&
      (event.clientY <= drawingCanvasRect.y + 10) &&
      (event.clientX <= drawingCanvasRect.x + drawingCanvasRect.width)
    );
    if (!drawingMouseDown && isWithinBoundary && !drawingMenu.classList.contains(drawingMenuOpenClassName)) {
      drawingMenu.classList.add(drawingMenuOpenClassName);
      drawingInstructions.style.opacity = 0;
      window.setTimeout(()=>{drawingInstructions.style.display = "none";}, 1000);
    }
    else if (!isWithinBoundary && drawingMenu.classList.contains(drawingMenuOpenClassName) && !event.srcElement.classList.contains("drawing-interface-menu-keep-open")) {
      drawingMenu.classList.remove(drawingMenuOpenClassName);
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
    if (event.type === "mousedown") {
      colorPickerMouseDown = true;
    }
    else if (event.type === "mouseup") {
      colorPickerMouseDown = false;
    }

    if (colorPickerMouseDown) {
      //Display the color picker display with the
      // correct color, in the correct position
      const colorPickerCanvasWidth = colorPickerCanvas.getBoundingClientRect().width;
      const value = Math.floor((event.offsetX < 0 ? 0 : (event.offsetX > totalNumberOfColors ? totalNumberOfColors : event.offsetX)) / colorPickerCanvasWidth * totalNumberOfColors);
      const color = getColorFromValue(value);
      const colorPickerDisplayOffset = 5; //px
      drawingSizeCircle.style.backgroundColor = color;
      colorPickerDisplay.style.backgroundColor = color;
      colorPickerDisplay.style.display = "block";
      colorPickerDisplay.style.top = event.pageY-colorPickerDisplayOffset+"px";
      colorPickerDisplay.style.left = event.pageX+colorPickerDisplayOffset+"px";

      drawingCanvasContext.beginPath();
      drawingCanvasContext.strokeStyle = color;
    }
    else {
      colorPickerDisplay.style.display = "none";
    }
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
      //clear our canvas and redraw all but the last touch
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

  window.drawing.openEditMenu = function() {

  }

  //Set our button to disabled
  checkButtonDisable("drawing-undo");
  checkButtonDisable("drawing-redo");

  //Attach our pen down/up listeners
  window.addEventListener("mousedown", handleDrawingOnMouseDownUp);
  window.addEventListener("mouseup", handleDrawingOnMouseDownUp);
  window.addEventListener("mousemove", handleMenuOpenOnMouseMove);
  drawingSizeInput.addEventListener("input", handleOnInput);
  initializeColorPickerCanvas();
  colorPickerCanvas.addEventListener("mousedown", handleColorPickerCanvasOnMouseDownUp);
  colorPickerCanvas.addEventListener("mouseup", handleColorPickerCanvasOnMouseDownUp);
  colorPickerCanvas.addEventListener("mousemove", handleColorPickerCanvasOnMouseDownUp);
})();
