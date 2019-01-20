let skipsRemaining = 0;
let sleepMode = false;

const checkSleepMode = () => {
  try {
    if (!sleepMode) {
      chrome.storage.local.get("sleepCounter", result => {
        skipsRemaining = result.sleepCounter || 0;
        sleepMode = skipsRemaining > 0;
        console.log("ComfyFlix is now active.");
        console.log(
          `Settings:\nSleep Mode: ${sleepMode}\n`
        );
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const tryClickFlatButton = (nextButton, phrase) => {
  try {
    if (window.location.href.includes("/watch/")) {
      for (let i = 0; i < nextButton.length; i++) {
        const element = nextButton[i];
        const content = element.innerHTML.toLocaleLowerCase();
        const searchRegEx = new RegExp(phrase);
        if (searchRegEx.test(content)) {
          element.click();
          return true;
        }
      }
      return false;
    }
  } catch (e) {
    console.debug(e);
  }
};

const tryClickContainer = watchNextContainer => {
  try {
    if (window.location.href.includes("/watch/")) {
      watchNextContainer[0].click();
      return true;
    }
    return false;
  } catch (e) {
    console.debug(e);
  }
};

const shouldSleep = (skipsRemaining, sleepModeActive) => {
  return skipsRemaining === 0 && sleepModeActive;
};

const returnHome = () => {
  console.log(
    "Skipped desired number of episodes. Redirecting to homepage... ~ComfyFlix"
  );
  observer.disconnect();
  window.location.replace("https://netflix.com/");
};

const trySkipIntro = buttonsWithText => {
  return tryClickFlatButton(buttonsWithText, "skip intro");
};

let observer = new MutationObserver(() => {
  if (!sleepMode || !stopAutoplay || !muteAutoplay) {
    checkSleepMode();
  }

  let buttonsWithText = document.querySelectorAll(".nf-flat-button-text");
  let watchNextContainer = document.querySelectorAll(
    ".WatchNext-still-hover-container"
  );
  let possibleButtons = [buttonsWithText, watchNextContainer];

  possibleButtons.forEach(buttonsWithText => {
    if (buttonsWithText.length > 0) {
      if (trySkipIntro(buttonsWithText)) {
        observer.disconnect();
        setTimeout(() => {
          observer.observe(targetNode, observerConfig);
        }, 10000);
      } else if (
        tryClickFlatButton(buttonsWithText, "next episode") ||
        tryClickContainer(watchNextContainer)
      ) {
        if (shouldSleep(skipsRemaining, sleepMode)) {
          returnHome();
        } else if (skipsRemaining > 0) {
          let episodeVerbage = skipsRemaining > 1 ? "episodes" : "episode";
          console.log(
            `Comfyflix skipped to next episode for you. ${skipsRemaining} ${episodeVerbage} remaining before shutdown.`
          );
          skipsRemaining = skipsRemaining - 1;
          watchNextContainer = undefined;
          observer.disconnect();
        }
      }
      setTimeout(() => {
        observer.observe(targetNode, observerConfig);
      }, 10000);
    }
  });
});

checkSleepMode();
const observerConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: false
};
const targetNode = document.body;
observer.observe(targetNode, observerConfig);
