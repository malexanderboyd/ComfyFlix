async function watch() {
  if (window.location.href.includes("/watch/")) {
    getSleepSettings().then(async sleepModeSettings => {
      let sleepMode = sleepModeSettings[0];
      let skipsRemaining = sleepModeSettings[1];
      console.debug(
        `Settings: Sleep Mode: ${sleepMode}\n Skips: ${skipsRemaining}`
      );

      let buttonsWithText = document.querySelectorAll(".nf-flat-button-text");
      let watchNextContainer = document.querySelectorAll(
        ".WatchNext-still-hover-container"
      );

      if (tryClickContainer(watchNextContainer)) {
        const container = watchNextContainer[0];
        if (sleepMode) {
            skipsRemaining = await decrementSkips(skipsRemaining);
            if (shouldSleep(skipsRemaining, sleepMode)) {
                await returnHome();
            }
        }
          container.click();
      }

      for (let idx = 0; idx < buttonsWithText.length; idx++) {
        const curr_button = buttonsWithText[idx];
        if (curr_button) {
          // if (trySkipIntro(curr_button)) {
          //   curr_button.click();
          //   break;
          // } TODO - figure out why this pauses 
          if (tryClickFlatButton(curr_button, "next episode")) {
            if (sleepMode) {
              skipsRemaining = await decrementSkips(skipsRemaining);
              if (shouldSleep(skipsRemaining, sleepMode)) {
                await returnHome();
              }
            }
              curr_button.click();
          }
        }
      }
    });
  }
}

window.setInterval(async () => {
  await watch();
}, 5000);

async function decrementSkips(skipsRemaining) {
  const episodeVerbage = skipsRemaining > 1 ? "episodes" : "episode";
  console.log(
    `Comfyflix skipped to next episode for you. ${skipsRemaining} ${episodeVerbage} remaining before shutdown.`
  );
  return await setSkipsRemaining(skipsRemaining - 1);
}

const getSleepSettings = () => {
  return new Promise(resolve => {
    chrome.storage.local.get("sleepCounter", async result => {
      const raw = result.sleepCounter || 0;
      if (isNaN(raw)) {
        return [false, 0];
      }
      const skipsRemaining = parseInt(raw) || 0;
      if(skipsRemaining > 0) {
          await setSleepMode(true);
      }
      const sleepMode = await getSleepMode();

      resolve([sleepMode, skipsRemaining]);
    });
  });
};

async function setSkipsRemaining(newSkipsRemaining) {
  return new Promise(resolve => {
    chrome.storage.local.set({ sleepCounter: newSkipsRemaining }, () => {
      resolve(newSkipsRemaining);
    });
  });
}

async function getSleepMode() {
    return new Promise(resolve => {
        chrome.storage.local.get('sleepMode', result => {
            const raw = result.sleepMode || false;
            if(raw !== true && raw !== false) {
                return false;
            }
            resolve(raw)
        })
    })
}

async function setSleepMode(newSleepMode) {
    return new Promise(resolve => {
        chrome.storage.local.set({sleepMode: newSleepMode}, () => {
            resolve(newSleepMode)
        })
    })
}


const tryClickFlatButton = (curr_button, phrase) => {
  const content = curr_button.innerHTML.toLocaleLowerCase();
  console.debug(`Content: ${content}`);
  console.debug(`Phrase: ${phrase}`);
  const searchRegEx = new RegExp(phrase);
  if (searchRegEx.test(content) && curr_button) {
    return true;
  }
  return false;
};

const tryClickContainer = watchNextContainer => {
  try {
    if (window.location.href.includes("/watch/")) {
      const container = watchNextContainer[0];
      if (container) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.debug(e);
  }
};

const shouldSleep = (skipsRemaining, sleepModeActive) => {
  return skipsRemaining < 0 && sleepModeActive;
};

const returnHome = async () => {
  console.log(
    "Skipped desired number of episodes. Redirecting to homepage... ~ComfyFlix"
  );
  window.location.replace("https://netflix.com/");
  await setSleepMode(false);
  return true
};

const trySkipIntro = curr_button => {
  return tryClickFlatButton(curr_button, "skip intro");
};
