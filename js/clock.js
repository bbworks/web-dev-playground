(function() {
  const clock = {
    second: {
      name: "second",
      element: document.getElementById("clock-hand-second"),
      increment: 0, //so we don't go from 355deg to 0deg, makes an AWFUL CSS transition
      value: 0.00,
      degrees: 0,
      total: 60,
    },
    minute: {
      name: "minute",
      element: document.getElementById("clock-hand-minute"),
      increment: 0, //so we don't go from 355deg to 0deg, makes an AWFUL CSS transition
      value: 0.00,
      degrees: 0,
      total: 60,
    },
    hour: {
      name: "hour",
      element: document.getElementById("clock-hand-hour"),
      increment: 0, //so we don't go from 355deg to 0deg, makes an AWFUL CSS transition
      value: 0.00,
      degrees: 0,
      total: 12,
    },
  };
  const digitalClock = {
    hour: {
      element: document.getElementById("digital-clock-hour"),
      displayValue: "",
    },
    minute: {
      element: document.getElementById("digital-clock-minute"),
      displayValue: "",
    },
    meridian: {
      element: document.getElementById("digital-clock-meridian"),
      displayValue: "",
    }
  };

  //Declare functions
  const updateHandAngle = function(date, handObject) {
    //Get the number of hours/minutes/seconds
    const getUpper = (string) => string.toUpperCase();
    const func = "get"+handObject.name.replace(/(\w)/,getUpper)+"s";
    handObject.value = date[func]();

    //If we hit 0 (i.e. a full cycle),
    // increment so we keep our degrees going PAST 360,
    // as this makes for a smooth CSS transition in one direction
    if (handObject.value === 0) {
      handObject.increment++;
    }

    //Now, also add the small increments on our hour/minute handObject,
    // and update the digital clock
    switch (handObject.name)
    {
      case "minute": {
        handObject.value += clock.second.value/clock.second.total;
        digitalClock[handObject.name].displayValue = (Math.floor(clock.minute.value % clock.minute.total).toString().length === 1 ? "0" : "") + Math.floor(clock.minute.value % clock.minute.total).toString();
        break;
      }
      case "hour": {
        handObject.value += clock.minute.value/clock.minute.total
        digitalClock[handObject.name].displayValue = (Math.floor(clock.hour.value % clock.hour.total).toString().length === 1 ? "0" : "") + Math.floor(clock.hour.value % clock.hour.total).toString();
        digitalClock.meridian.displayValue = (Math.floor(clock.hour.value) / 12 >= 1 ? "PM" : "AM");
        digitalClock.meridian.element.innerText = digitalClock.meridian.displayValue;
        break;
      }
    };

    //Calcualte the number of degrees for this handObject
    handObject.degrees = (handObject.value + (handObject.increment * handObject.total)) / handObject.total * 360;
  };

  const updateClock = function() {
    const date = new Date();
    const clockSize = document.getElementById("clock").getBoundingClientRect().width;

    //Loop through, updating hour, minute, second
    for (let handName in clock) {
      let hand = clock[handName];
      updateHandAngle(date, hand);
      hand.element.style.transform = `rotate(${hand.degrees}deg)`;
      if (hand.name === "hour" || hand.name === "minute") {
        digitalClock[hand.name].element.innerText = digitalClock[hand.name].displayValue;
      }
    }
  };

  updateClock();
  let renderClock = window.setInterval(updateClock, 1000);
  window.clock = clock;
})();
