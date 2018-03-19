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


var observer = new MutationObserver(function (mutations) {
	if (!sleepMode)
		checkSleepMode();
	var watchNextContainer = document.querySelectorAll('.WatchNext-still-hover-container');
	if (watchNextContainer.length > 0 && skipsRemaining == 0 && sleepMode == true) {
		console.log("Skipped desired number of episodes. Redirecting to homepage... ~ComfyFlix");
		window.location = "https://netflix.com/";
		throw new Error("Stopping ComfyFlix.");
	}
	else if (watchNextContainer.length > 0 && skipsRemaining >= 0) {
		try {
					watchNextContainer[0].click();
				} catch (e) {
					console.debug(e);
				}
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
}, 12000);
console.log('ComfyFlix is now active.');
