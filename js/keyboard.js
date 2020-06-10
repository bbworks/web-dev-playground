(function() {
  const keyboardStyleSheet = new Array(...document.styleSheets).filter(item=>item.href.match("keyboard.css"))[0];
  let keyboardColorValue = 0;
  const keyDownClassName = "key-down";

  // const KEY = {
	// 	CANCEL: 3, //Cancel key.
	// 	HELP: 6, //Help key.
	// 	BACK_SPACE: 8, //Backspace key.
	// 	TAB: 9, //Tab key.
	// 	CLEAR: 12, //"5" key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key.
	// 	RETURN: 13, //Return/enter key on the main keyboard.
	// 	ENTER: 14, //Reserved, but not used. Obsolete since Gecko 30 (Dropped, see bug 969247.)
	// 	SHIFT: 16, //Shift key.
	// 	CONTROL: 17, //Control key.
	// 	ALT: 18, //Alt (Option on Mac) key.
	// 	PAUSE: 19, //Pause key.
	// 	CAPS_LOCK: 20, //Caps lock.
	// 	ESCAPE: 27, //Escape key.
	// 	SPACE: 32, //Space bar.
	// 	PAGE_UP: 33, //Page Up key.
	// 	PAGE_DOWN: 34, //Page Down key.
	// 	END: 35, //End key.
	// 	HOME: 36, //Home key.
	// 	LEFT: 37, //Left arrow.
	// 	UP: 38, //Up arrow.
	// 	RIGHT: 39, //Right arrow.
	// 	DOWN: 40, //Down arrow.
	// 	PRINTSCREEN: 44, //Print Screen key.
	// 	INSERT: 45, //Ins(ert) key.
	// 	DELETE: 46, //Del(ete) key.
	// 	0: 48, //"0" key in standard key location.
	// 	1: 49, //"1" key in standard key location.
	// 	2: 50, //"2" key in standard key location.
	// 	3: 51, //"3" key in standard key location.
	// 	4: 52, //"4" key in standard key location.
	// 	5: 53, //"5" key in standard key location.
	// 	6: 54, //"6" key in standard key location.
	// 	7: 55, //"7" key in standard key location.
	// 	8: 56, //"8" key in standard key location.
	// 	9: 57, //"9" key in standard key location.
	// 	COLON: 58, //Colon (":") key.
	// 	LESS_THAN: 60, //Less-than ("<") key.
	// 	GREATER_THAN: 62, //Greater-than (">") key.
  //   QUESTION_MARK: 63, //Question mark ("?") key.
	// 	AT: 64, //Atmark ("@") key.
	// 	A: 65, //"A" key.
	// 	B: 66, //"B" key.
	// 	C: 67, //"C" key.
	// 	D: 68, //"D" key.
	// 	E: 69, //"E" key.
	// 	F: 70, //"F" key.
	// 	G: 71, //"G" key.
	// 	H: 72, //"H" key.
	// 	I: 73, //"I" key.
	// 	J: 74, //"J" key.
	// 	K: 75, //"K" key.
	// 	L: 76, //"L" key.
	// 	M: 77, //"M" key.
	// 	N: 78, //"N" key.
	// 	O: 79, //"O" key.
	// 	P: 80, //"P" key.
	// 	Q: 81, //"Q" key.
	// 	R: 82, //"R" key.
	// 	S: 83, //"S" key.
	// 	T: 84, //"T" key.
	// 	U: 85, //"U" key.
	// 	V: 86, //"V" key.
	// 	W: 87, //"W" key.
	// 	X: 88, //"X" key.
	// 	Y: 89, //"Y" key.
	// 	Z: 90, //"Z" key.
	// 	WIN: 91, //Windows logo key on Windows. Or Super or Hyper key on Linux.
	// 	CONTEXT_MENU: 93, //Opening context menu key.
	// 	NUMPAD0: 96, //"0" on the numeric keypad.
	// 	NUMPAD1: 97, //"1" on the numeric keypad.
	// 	NUMPAD2: 98, //"2" on the numeric keypad.
	// 	NUMPAD3: 99, //"3" on the numeric keypad.
	// 	NUMPAD4: 100, //"4" on the numeric keypad.
	// 	NUMPAD5: 101, //"5" on the numeric keypad.
	// 	NUMPAD6: 102, //"6" on the numeric keypad.
	// 	NUMPAD7: 103, //"7" on the numeric keypad.
	// 	NUMPAD8: 104, //"8" on the numeric keypad.
	// 	NUMPAD9: 105, //"9" on the numeric keypad.
	// 	MULTIPLY: 106, //"*" on the numeric keypad.
	// 	ADD: 107, //"+" on the numeric keypad.
	// 	SUBTRACT: 109, //"-" on the numeric keypad.
	// 	DECIMAL: 110, //Decimal point on the numeric keypad.
	// 	DIVIDE: 111, //"/" on the numeric keypad.
	// 	F1: 112, //F1 key.
	// 	F2: 113, //F2 key.
	// 	F3: 114, //F3 key.
	// 	F4: 115, //F4 key.
	// 	F5: 116, //F5 key.
	// 	F6: 117, //F6 key.
	// 	F7: 118, //F7 key.
	// 	F8: 119, //F8 key.
	// 	F9: 120, //F9 key.
	// 	F10: 121, //F10 key.
	// 	F11: 122, //F11 key.
	// 	F12: 123, //F12 key.
	// 	F13: 124, //F13 key.
	// 	F14: 125, //F14 key.
	// 	F15: 126, //F15 key.
	// 	F16: 127, //F16 key.
	// 	F17: 128, //F17 key.
	// 	F18: 129, //F18 key.
	// 	F19: 130, //F19 key.
	// 	F20: 131, //F20 key.
	// 	F21: 132, //F21 key.
	// 	F22: 133, //F22 key.
	// 	F23: 134, //F23 key.
	// 	F24: 135, //F24 key.
	// 	NUM_LOCK: 144, //Num Lock key.
	// 	SCROLL_LOCK: 145, //Scroll Lock key.
	// 	CIRCUMFLEX: 160, //Circumflex ("^") key.
	// 	EXCLAMATION: 161, //Exclamation ("!") key.
	// 	DOUBLE_QUOTE: 162, //Double quote (""") key.
	// 	HASH: 163, //Hash ("#") key.
	// 	DOLLAR: 164, //Dollar sign ("$") key.
	// 	PERCENT: 165, //Percent ("%") key.
	// 	AMPERSAND: 166, //Ampersand ("&") key.
	// 	UNDERSCORE: 167, //Underscore ("_") key.
	// 	OPEN_PAREN: 168, //Open parenthesis ("(") key.
	// 	CLOSE_PAREN: 169, //Close parenthesis (")") key.
	// 	ASTERISK: 170, //Asterisk ("*") key.
	// 	PLUS: 171, //Plus ("+") key.
	// 	PIPE: 172, //Pipe ("|") key.
	// 	OPEN_CURLY_BRACKET: 174, //Open curly bracket ("{") key.
	// 	CLOSE_CURLY_BRACKET: 175, //Close curly bracket ("}") key.
	// 	TILDE: 176, //Tilde ("~") key.
	// 	VOLUME_MUTE: 181, //Audio mute key.
	// 	VOLUME_DOWN: 182, //Audio volume down key
	// 	VOLUME_UP: 183, //Audio volume up key
  //   SEMICOLON: 186, //Semicolon (";") key.
	// 	EQUALS: 187, //Equals ("=") key.
	// 	COMMA: 188, //Comma (",") key.
  //   HYPHEN_MINUS: 189, //Hyphen-US/docs/Minus ("-") key.
	// 	PERIOD: 190, //Period (".") key.
	// 	SLASH: 191, //Slash ("/") key.
	// 	BACK_QUOTE: 192, //Back tick ("`") key.
	// 	OPEN_BRACKET: 219, //Open square bracket ("[") key.
	// 	BACK_SLASH: 220, //Back slash ("\") key.: 221, //Close square bracket ("]") key.
  //   CLOSE_BRACKET: 221, //Open square bracket ("[") key.
	// 	QUOTE: 222, //Quote (''') key.
	// 	ZOOM: 251, //Zoom key.
	// };

  const KEY = {
    "Esc": 27,
    "F1": 112,
    "F2": 113,
    "F3": 114,
    "F4": 115,
    "F5": 116,
    "F6": 117,
    "F7": 118,
    "F8": 119,
    "F9": 120,
    "F10": 121,
    "F11": 122,
    "F12": 123,
    "Del": 46,
    "`": 192,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "0": 48,
    "-": 189,
    "=": 187,
    "Backspace": 8,
    "Tab": 9,
    "Q": 81,
    "W": 87,
    "E": 69,
    "R": 82,
    "T": 84,
    "Y": 89,
    "U": 85,
    "I": 73,
    "O": 79,
    "P": 80,
    "[": 219,
    "]": 221,
    "\\": 220,
    "CapsLock": 20,
    "A": 65,
    "S": 83,
    "D": 68,
    "F": 70,
    "G": 71,
    "H": 72,
    "J": 74,
    "K": 75,
    "L": 76,
    ";": 186,
    "'": 222,
    "Enter": 13,
    "Shift": 16,
    "Z": 90,
    "X": 88,
    "C": 67,
    "V": 86,
    "B": 66,
    "N": 78,
    "M": 77,
    ",": 188,
    ".": 190,
    "/": 191,
    "Ctrl": 17,
    "Fn": null,
    "Windows": 91,
    "Alt": 18,
    "Space": 32,
    "ContextMenu": 93,
  };

  const getObjectPropertyNameFromValue = function(object, value) {
    return Object.keys(object)[Object.values(object).indexOf(Object.values(object).filter(item=>item === value)[0])];
  };

  const keyboardOnKeyDownUp = function(event) {
    let key = getObjectPropertyNameFromValue(KEY, event.keyCode);
    if (key) {
      if (
        event.keyCode === KEY.Ctrl ||
        event.keyCode === KEY.Shift ||
        event.keyCode === KEY.Alt
      ) {
        key += (event.location === 1 ? "Left" : (event.location === 2 ? "Right" : null));
      }
      const element = document.getElementById(key);

      if (event.type === "keydown" && !element.classList.contains(keyDownClassName)) {
        element.classList.add(keyDownClassName);
      }
      else if (event.type === "keyup" && element.classList.contains(keyDownClassName)) {
        element.classList.remove(keyDownClassName);
      }
    }
  };

  const getColorFromValue = function(originalValue) {
    const totalNumberOfColors = 1536;
    const value = originalValue % totalNumberOfColors;
    const numberOfColorSequences = 6;
    const colorSequenceLength = totalNumberOfColors/numberOfColorSequences;
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

  const setBoxShadowColor = function(keyboardKeyClassName, value) {
    const cssRule = new Array(...keyboardStyleSheet.rules).filter(item=>item.selectorText === keyboardKeyClassName)[0];
    const shadow = "2px 2px 2px "+value;
    cssRule.style.boxShadow = shadow;
    cssRule.style.color = value;
    cssRule.style.textShadow = shadow;
  };

  window.setInterval(()=>setBoxShadowColor(".keyboard-key", getColorFromValue(keyboardColorValue++)), 5);
  window.addEventListener("keydown", keyboardOnKeyDownUp);
  window.addEventListener("keyup", keyboardOnKeyDownUp);
})();
