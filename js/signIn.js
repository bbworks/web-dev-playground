(function() {
  //Create public singleton
  window.signIn = {};

  const signInForm = document.getElementById("sign-in-form");
  const loggedInForm = document.getElementById("logged-in-dashboard");
  const signInLoadingContainer = document.getElementById("sign-in-loading-container");

  const panelDisplayClassName = "display";
  const disabledInputClassName = "disabled";

  //Create our users and save them to localStorage
  let currentUser = null;
  const signInUsers = [
    {
      username: "admin",
      password: "password",
      nameFirst: "John",
      nameLast: "Doe",
      phoneNumber: "5555555555",
      emailAddress: "john.doe@email.com",
      addressStreet: "123 Street Avenue",
      addressCity: "Cityville",
      addressState: "AL",
      addressZipCode: "12345",
    },
  ];
  if (!window.localStorage.getItem("signIn")) {
    window.localStorage.setItem("signIn", JSON.stringify(signInUsers));
  }

  //Stop the form floating when we're focused on a component on it
  new Array(...document.getElementsByClassName("sign-in-component")).forEach(item=>{
      item.addEventListener("focus",
        ()=>{
          if(!signInForm.classList.contains("focus")) {
            signInForm.classList.add("focus");
          }
        }
      );

      item.addEventListener("blur",
        ()=>{
          if(signInForm.classList.contains("focus")) {
            signInForm.classList.remove("focus");
          }
        }
      );
    }
  );

  const loadUserInformation = function(user = currentUser) {
    const fields = document.getElementsByClassName("logged-in-input");
    for(let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = field.getAttribute("data-field");
      if (value === "phoneNumber") {
        field.value = currentUser[value].replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
      } else {
        field.value = currentUser[value];
      }
    }
  };

  const enableInput = function(input) {
    if (input.classList.contains(disabledInputClassName)) {
      input.classList.remove(disabledInputClassName);
      input.readOnly = false;
      input.focus();
      const priorValue = input.value;
      input.addEventListener("keydown", event=>handleInput.call(input, event, priorValue));
      window.addEventListener("mousedown", event=>handleInput.call(input, event, priorValue));
      window.addEventListener("touchstart", event=>handleInput.call(input, event, priorValue));
    }
  };

  const disableInput = function(input) {
    if (!input.classList.contains(disabledInputClassName)) {
      input.classList.add(disabledInputClassName);
      input.readOnly = true;
      input.removeEventListener("keydown", event=>handleInput.call(input, event, priorValue));
      window.removeEventListener("mousedown", event=>handleInput.call(input, event, priorValue));
      window.removeEventListener("touchstart", event=>handleInput.call(input, event, priorValue));
    }
  };

  const handleInput = function(event, priorValue) {
    if (event.type === "keydown" && event.keyCode === 13 /*Return*/) {
      const field = this.getAttribute("data-field");
      const newValue = this.value;
      submitInput(this, field, newValue);
    } else if (
      (event.type === "keydown" && event.keyCode === 27 /*Esc*/) ||
      ((event.type === "mousedown" || event.type === "touchstart") && event.srcElement !== this)
    ) {
      cancelInput(this, priorValue);
    }
  };

  const submitInput = function(input, field, value) {
    updateUser(field, value);
    disableInput(input);
  };

  const cancelInput = function(input, priorValue) {
    input.value = priorValue;
    disableInput(input);
  };

  const updateUser = function(field, value) {
    const authenticatedUsers = JSON.parse(window.localStorage.getItem("signIn"));
    const user = authenticatedUsers.filter(item=>item.username === currentUser.username)[0];
    const userIndex = authenticatedUsers.indexOf(user);

    authenticatedUsers[userIndex][field] = value;
    window.localStorage.setItem("signIn", JSON.stringify(authenticatedUsers));
  };


  signIn.authenticate = function() {
    event.preventDefault();

    //Display the loading screen, and purposely add 1 second wait time
    signInLoadingContainer.style.display = "block";

    window.setTimeout( ()=>{
        const username = document.getElementById("sign-in-username").value;
        const password = document.getElementById("sign-in-password").value;
        const authenticatedUsers = JSON.parse(window.localStorage.getItem("signIn"));

        const user = authenticatedUsers.filter(item=>item.username === username && item.password === password)[0];
        if (user) {
          new Array(...document.getElementsByClassName("sign-in-input")).forEach(item=>{item.value="";});
          currentUser = user;
          loadUserInformation();
          signInForm.classList.remove(panelDisplayClassName);
          loggedInForm.classList.add(panelDisplayClassName);
        } else {
          document.getElementById("sign-in-form-error").style.opacity = 1;
        }

        signInLoadingContainer.style.display = "none";
      } //end function
      , 1000
    ); //end setTimeout
  };

  signIn.logout = function() {
    //Display the loading screen, and purposely add 1 second wait time
    signInLoadingContainer.style.display = "block";

    // window.setTimeout( ()=>{
        currentUser = null;
        signInForm.classList.add(panelDisplayClassName);
        loggedInForm.classList.remove(panelDisplayClassName);
        signInLoadingContainer.style.display = "none";
    //   } //end function
    //   , 1000
    // ); //end setTimeout
  };

  signIn.editField = function() {
    const inputID = event.srcElement.getAttribute("data-input");
    const input = document.getElementById(inputID);
    enableInput(input);
  };
})();
