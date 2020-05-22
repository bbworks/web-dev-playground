(function() {
  const updateClock = function() {
     const date = new Date();
     const clock = {
        Hour: document.getElementsByClassName("clock-hand-hour")[0],
        Minute: document.getElementsByClassName("clock-hand-minute")[0],
        Second: document.getElementsByClassName("clock-hand-second")[0],
      };
     const clockSize = document.getElementsByClassName("clock")[0].getBoundingClientRect().width;
     const getDegrees = (date, hand) => {
      const currentTime = date["get"+hand+"s"]();
      let total;
      switch (hand.toLowerCase())
        {
          case "hour": {total = 12; break;}
          case "minute": {total = 60; break;}
          case "second": {total = 60; break;}
          default: null
        };
      return currentTime % total / total * 360;
    };

    for (let handName in clock) {
      let hand = clock[handName];
      hand.style.transform = `rotate(${getDegrees(date, handName)}deg)`;
    }
  };
  updateClock();
  let renderClock = window.setInterval(updateClock, 1000);
})();
