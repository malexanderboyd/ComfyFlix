var skipsRemaining = 0;
var sleepMode = false;
function checkSleepMode() {
	try {
		chrome.storage.local.get('counter', function (result) {
			skipsRemaining = result.counter;
			if (skipsRemaining > 0) {
				sleepMode = true;
			}
			else {
				skipsRemaining = 0
				sleepMode = false;
			}
		});
	} catch (e) {
		console.log(e);
	}
}


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
	if (!sleepMode)
		checkSleepMode();
	var buttonsWithText = document.querySelectorAll('.nf-flat-button-text');
	var watchNextContainer = document.querySelectorAll('.WatchNext-still-hover-container')
	var possibleButtons = [buttonsWithText, watchNextContainer]
	possibleButtons.forEach((buttonsWithText) => {
		if (buttonsWithText.length > 0) {
			if (tryClickFlatButton(buttonsWithText, 'skip intro')) {
				observer.disconnect();
				setTimeout(() => {
					observer.observe(targetNode, observerConfig);
				}, 10000)
			} else if (tryClickFlatButton(buttonsWithText, 'next episode') || tryClickContainer(watchNextContainer)) {
				if (skipsRemaining == 0 && sleepMode == true) {
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
var observerConfig = { attributes: true, childList: true, subtree: true, characterData: false };
var targetNode = document.body;
observer.observe(targetNode, observerConfig);
console.log('ComfyFlix is now active.');