let skipsRemaining = 0;
let sleepMode = false;
let stopAutoplay = false;
let muteAutoplay = false;

const checkSleepMode = () => {
	try {
		if(!sleepMode) {
            chrome.storage.local.get('sleepCounter', (result) => {
                skipsRemaining = result.sleepCounter || 0;
                sleepMode = skipsRemaining > 0;
                console.log('ComfyFlix is now active.');
                console.log(`Settings:\nSleep Mode: ${sleepMode}\nMute Autoplay: ${muteAutoplay}\nStop Autoplay: ${stopAutoplay}`);
            })
		}
	} catch (e) {
		console.log(e);
	}
};

const checkStopAutoplay = () => {
	try {
		chrome.storage.local.get('stopAutoplay', (result) => {
			stopAutoplay = result.stopAutoplay;
		})
	} catch(e) {
		console.log(e);
	}
};

const checkMuteAutoplay = () => {
    try {
        chrome.storage.local.get('muteAutoplay', (result) => {
            muteAutoplay = result.muteAutoplay;
        })
    } catch(e) {
        console.log(e);
    }
};


function tryClickFlatButton(nextButton, phrase) {
	try {
		if (window.location.href.includes('/watch/')) {
			for (let i = 0; i < nextButton.length; i++) {
				const element = nextButton[i];
				const content = element.innerHTML.toLocaleLowerCase();
				const searchRegEx = new RegExp(phrase)
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
}

function tryClickContainer(watchNextContainer) {
	try {
		if (window.location.href.includes('/watch/')) {
			watchNextContainer[0].click();
			return true;
		}
		return false;
	} catch (e) {
		console.debug(e);
	}
}

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

var observer = new MutationObserver(function (mutations) {
	if (!sleepMode || !stopAutoplay || !muteAutoplay) {
        checkSleepMode();
        checkStopAutoplay();
        checkMuteAutoplay();
    }

    if(stopAutoplay || muteAutoplay) {
    	if(stopAutoplay) {
    		let billboards = document.querySelectorAll('.billboard-row');
    		if(billboards.length === 1) {
    			billboards[0].style.display = "none";
			}
		}
		if(muteAutoplay) {
			let billboardMuteButton = document.querySelectorAll('.global-supplemental-audio-toggle');
			if(billboardMuteButton.length === 1) {
				for(let i = 0; i < billboardMuteButton[0].children.length; i++) {
					let child = billboardMuteButton[0].children.item(i);
					if(child.nodeName.toUpperCase() === "DIV") {
						const childChildren = child.children;
						const len = childChildren.length;
						for(let j = 0; j < len; j++) {
							const child = childChildren.item(j);
							if (child.nodeName.toUpperCase() === "A") {
								if (child.className.includes('nf-svg-button')) {
									if (!child.className.includes('clicked'))
										child.click();
									break;
								}
							}
						}
					}
				}
			}
		}
	}


	let buttonsWithText = document.querySelectorAll('.nf-flat-button-text');
	let watchNextContainer = document.querySelectorAll('.WatchNext-still-hover-container');
	let possibleButtons = [buttonsWithText, watchNextContainer];
	possibleButtons.forEach((buttonsWithText) => {
		if (buttonsWithText.length > 0) {
			if (tryClickFlatButton(buttonsWithText, 'skip intro')) {
				observer.disconnect();
				setTimeout(() => {
					observer.observe(targetNode, observerConfig);
				}, 10000)
			} else if (tryClickFlatButton(buttonsWithText, 'next episode') || tryClickContainer(watchNextContainer)) {
				if (skipsRemaining === 0 && sleepMode === true) {
					console.log("Skipped desired number of episodes. Redirecting to homepage... ~ComfyFlix");
					observer.disconnect();
					window.location.replace("https://netflix.com/");
				} else if (skipsRemaining > 0) {
					let episodeVerbage = skipsRemaining > 1 ? 'episodes' : 'episode'
					console.log(`Comfyflix skipped to next episode for you. ${skipsRemaining} ${episodeVerbage} remaining before shutdown.`);
					skipsRemaining = skipsRemaining - 1;
					buttonsWithText = undefined;
					watchNextContainer = undefined;
					observer.disconnect();
				}
			}
			setTimeout(() => {
				observer.observe(targetNode, observerConfig);
			}, 10000)
		}
	})

});
checkStopAutoplay();
checkMuteAutoplay();
checkSleepMode();
var observerConfig = { attributes: true, childList: true, subtree: true, characterData: false };
var targetNode = document.body;
observer.observe(targetNode, observerConfig);