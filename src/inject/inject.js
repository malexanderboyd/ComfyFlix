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
			}
		});
	} catch(e) {

	}
}


function tryClickFlatButton(nextButton, phrase) {
			try {
				nextButton.forEach(function(element) {
					eleAttributes = element.attributes
					for(var i = 0; i < eleAttributes.length; i++) {
						var attribute = eleAttributes.item(i);
						if (attribute.value.includes(phrase) || attribute.value.includes(phrase.capitalize()) || element.innerHTML.includes(phrase) || element.innerHTML.includes(phrase.capitalize())) {
							element.click();
							console.log('Skipped ' + phrase.capitalize());
							break;
						}
					}
					});
			} catch(e) {
				console.debug(e);
			}
}

function tryClickContainer(watchNextContainer) {
		try {
					watchNextContainer[0].click();
				} catch (e) {
					console.debug(e);
				}
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var observer = new MutationObserver(function (mutations) {
	if (!sleepMode)
		checkSleepMode();
	var watchNextContainer = document.querySelectorAll('.WatchNext-still-hover-container');
	var nextButton = document.querySelectorAll('.nf-flat-button-primary');
	var skipIntro = document.querySelectorAll('.nf-flat-button-text');

	if(skipIntro.length > 0) {
		tryClickFlatButton(skipIntro, 'intro')
	}

	if ((nextButton.length > 0 || watchNextContainer.length > 0) && skipsRemaining == 0 && sleepMode == true) {
		console.log("Skipped desired number of episodes. Redirecting to homepage... ~ComfyFlix");
		window.location = "https://netflix.com/";
		throw new Error("Stopping ComfyFlix.");
	}
	else if ((nextButton.length > 0 || watchNextContainer.length > 0) && skipsRemaining >= 0) {
				tryClickContainer(watchNextContainer);
				tryClickFlatButton(nextButton, 'episode');
		}
		if (skipsRemaining > 0) {
			console.log("skipped the countdown for you " + skipsRemaining + " episode(s) remaining before stopping. ~ComfyFlix");
			skipsRemaining = skipsRemaining-1;
			watchNextContainer = undefined
		}
});
var observerConfig = { attributes: true, childList: true, subtree: true, characterData: false };
var targetNode = document.body;
setTimeout(function () {
	observer.observe(targetNode, observerConfig);
}, 4000);
console.log('ComfyFlix is now active.');
