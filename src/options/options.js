//////////////////////////// UI ///////////////////////////////////////
//                                                                   //
//   This function deals with options/index.html   //
//                        enables sleep mode view       //
//////////////////////////// END UI ///////////////////////////////////

document.getElementById("sleepModeCheck").addEventListener("click", function() {
  var sleepChildren = document.getElementById("sleepModeEnabled").children;
  if (document.getElementById("sleepModeCheck").checked) {
    for (let i = 0; i < sleepChildren.length; i++) {
      sleepChildren[i].style.display = "block";
    }
  } else {
    for (let i = 0; i < sleepChildren.length; i++) {
      sleepChildren[i].style.display = "none";
    }
    chrome.storage.local.set({ counter: 0 }, function() {
      console.log("Sleep Mode Disabled");
    });
    document.getElementById("settingsSavedWindow").style.display = "none";
  }
});

//////////////////////////// LocalStorage /////////////////////////////
//                                                                   //
//         This function deals with storing skip counter             //
//                                                                   //
//////////////////////////// END UI ///////////////////////////////////

document.getElementById("saveOptions").addEventListener("click", function() {
  let skipCount = document.getElementById("skipNumberBox").value;

  chrome.storage.local.clear(err => {
    console.log(err);
  });
  localStorage.setItem("sleepCounter", skipCount);
  chrome.storage.local.set(
    {
      sleepCounter: skipCount
    },
    () => {
      console.log(
        `Settings Saved.\nSkipping Episodes ${
          skipCount > 0 ? `Yes: ${skipCount}` : "No"
        }`
      );
      document.getElementById("settingsSavedWindow").style.display = "block";
    }
  );
});
