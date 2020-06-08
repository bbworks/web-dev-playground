(function() {
  //Create public singleton
  window.cards = {};

  //Create private variables
  const cardContainer = document.getElementById("card-container");
  const numOfCards = 20;
  const cards = [];
  let attempts = 0;
  let matches = 0;
  const cardFlippedClassName = "card-flipped";

  let chosenCards = [];

  // let getObjectChildByClass = function(parentObject, className) {
  //   return new Array(...parentObject.children).find(item=>item.classList.contains(className));
  // };
  // getObjectChildByClass(getObjectChildByClass(getObjectChildByClass(card, "card-face-front"), "card-face-suit-number-container"), "card-face-suit-number");
  // getObjectChildByClass(getObjectChildByClass(getObjectChildByClass(card, "card-face-front"), "card-face-suit-number-container"), "card-face-suit-number");
  // getObjectChildByClass(getObjectChildByClass(getObjectChildByClass(card, "card-face-front"), "card-face-suit-number-container"), "card-face-suit-number");

  const addCard = function() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("card-flipped");
    card.onclick = window.cards.flipCard.bind(this, event, card);

    const html =
      // "<div class=\"card card-flipped\" data-card-suit=\"\" data-card-number=\"\" onclick=\"cards.flipCard(event, this)\">" + "\r\n" +
      "  <div class=\"card-face card-face-front\">" + "\r\n" +
      "    <div class=\"card-face-suit-number-container card-face-suit-number-container-top\">" + "\r\n" +
      "      <span class=\"card-face-suit-number card-face-number\"></span>" + "\r\n" +
      "      <span class=\"card-face-suit-number card-face-suit\"></span> <!-- ♥️♠️♦️♣️ -->" + "\r\n" +
      "    </div>" + "\r\n" +
      "    <div class=\"card-face-image\"></div>" + "\r\n" +
      "    <div class=\"card-face-suit-number-container card-face-suit-number-container-bottom\">" + "\r\n" +
      "      <span class=\"card-face-suit-number card-face-number\"></span>" + "\r\n" +
      "      <span class=\"card-face-suit-number card-face-suit\"></span> <!-- ♥️♠️♦️♣️ -->" + "\r\n" +
      "    </div>" + "\r\n" +
      "  </div>" + "\r\n" +
      "  <div class=\"card-face card-face-back\"></div>" + "\r\n" +
      // "</div>" + "\r\n" +
      "";

      cardContainer.appendChild(card);
      card.innerHTML = html;
      return card;
  };

  const setCard = function(card, number, suit) {
    card.setAttribute("data-card-suit", suit);
    card.setAttribute("data-card-number", number);
  };

  const chooseCard = function(card) {
    if (chosenCards.length < 2) {
      chosenCards.push(card);
    }

    if (chosenCards.length === 2) {
      attempts++;
      validateChoices();
      updateCounters();
    }
  };

  const validateChoices = function() {
    if (
      chosenCards[0].getAttribute("data-card-number") === chosenCards[1].getAttribute("data-card-number") &&
      chosenCards[0].getAttribute("data-card-suit") === chosenCards[1].getAttribute("data-card-suit")
    ) {
      chosenCards = [];
      matches++;
      return true;
    }

    chosenCards.forEach(item=>{window.setTimeout(()=>{item.classList.add(cardFlippedClassName);}, 1000);});
    chosenCards = [];
    return false;
  };

  const updateCounters = function() {
    const matchesRemainingCounter = document.getElementById("matches-remaining-counter");
    const attemptsCounter = document.getElementById("attempts-counter");

    matchesRemainingCounter.innerText = (numOfCards/2)-matches;
    attemptsCounter.innerText = attempts;
  };

  const init = function() {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const suits = ["heart" ,"spade", "diamond", "club"];

    //Create the cards
    for (let i = 0; i < numOfCards; i++) {
      cards.push(addCard());
    }

    //Let's create an array of all the cards
    const cardsArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
    let number;
    let suit;
    while (cardsArray.length) {
      if (cardsArray.length % 2 == 0) {
        //Pick a random number and suit (every 2 cards)
        // NOTE: This keeps it the same for every 2 cards, starting from the start
        number = numbers[Math.floor(Math.random() * numbers.length)];
        suit = suits[Math.floor(Math.random() * suits.length)];
      }

      //Pick a random card
      const cardIndex = cardsArray[Math.floor(Math.random() * cardsArray.length)];

      //Add that card to the chosen index
      setCard(cards[cardIndex], number, suit);

      //Now, remove that index from the choices
      cardsArray.splice(cardsArray.indexOf(cardIndex),1);
    }

    updateCounters();
  };

  window.cards.flipCard = function(event, card) {
    if (card.classList.contains(cardFlippedClassName)) {
      card.classList.remove(cardFlippedClassName);
      chooseCard(card);
    }
  };

  //Set up everything
  init();
})();
