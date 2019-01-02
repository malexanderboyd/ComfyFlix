//////////////////////////// UI ///////////////////////////////////////
//                                                                   //
//   This function deals with options/index.html   //
//                        enables sleep mode view       //
//////////////////////////// END UI ///////////////////////////////////


document.getElementById('sleepModeCheck').addEventListener("click", function () {

    var sleepChildren = document.getElementById('sleepModeEnabled').children;
    if (document.getElementById('sleepModeCheck').checked) {

        for (var i = 0; i < sleepChildren.length; i++) {
            sleepChildren[i].style.display = "block";
        }
    }
    else {
        for (var i = 0; i < sleepChildren.length; i++) {
            sleepChildren[i].style.display = "none";
        }
        chrome.storage.local.set({'counter': 0}, function () {
            console.log("Sleep Mode Disabled");
        });
        document.getElementById('settingsSavedWindow').style.display = "none";
    }

});

//////////////////////////// LocalStorage /////////////////////////////
//                                                                   //
//         This function deals with storing skip counter             //
//                                                                   //
//////////////////////////// END UI ///////////////////////////////////


document.getElementById('saveOptions').addEventListener("click", function () {

    let skipCount = document.getElementById('skipNumberBox').value;

    const stopAutoplay = document.getElementById('stopAutoplayToggle').checked;

    const muteAutoplay = document.getElementById('muteAutoplayToggle').checked;

    skipCount = skipCount > 0 ? skipCount : 0;
    chrome.storage.local.clear((err) => {
        console.log(err);
    });
    localStorage.setItem("sleepCounter", skipCount);
    localStorage.setItem("stopAutoplay", stopAutoplay);
    localStorage.setItem("muteAutoplay", muteAutoplay);
    chrome.storage.local.set(
        {
            'sleepCounter': skipCount,
            'stopAutoplay': stopAutoplay,
            'muteAutoplay': muteAutoplay
        }, () => {
            console.log(`Settings Saved.\nStopping Autoplay ${stopAutoplay}\nSkipping Episodes ${skipCount > 0 ? `Yes: ${skipCount}` : 'No'}\nMute Autoplay: ${muteAutoplay}`)
            document.getElementById('settingsSavedWindow').style.display = "block";
        });
});




