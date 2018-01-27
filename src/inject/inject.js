

var skipsRemaining = 0;
var sleepMode = false;
function checkSleepMode()
{
	chrome.storage.local.get('counter', function(result) {
		skipsRemaining = result.counter;
		if(skipsRemaining > 0)
		{
		sleepMode = true;
		}
		else
		{
		skipsRemaining = 0
		}
	});
}


var observer = new MutationObserver(function(mutations) {
	 if(!sleepMode)
			checkSleepMode();
    var isItTwo = document.querySelectorAll('div.WatchNext');
	var isItTwo2 = document.querySelectorAll('.nf-flat-button-primary')
 	if((isItTwo2.length || isItTwo.length) && skipsRemaining == 0 && sleepMode == true)
	{
		console.log("Skipped desired number of episodes. Redirecting to homepage... ~ComfyFlix");
		window.location = "https://netflix.com/";
		throw new Error("Stopping ComfyFlix.");
	}
    	else if ((isItTwo.length || isItTwo2.length) && skipsRemaining >= 0)
	{
        var nxtButton = document.querySelectorAll('div.WatchNext-still-container')
		var nxtButton2 = document.querySelectorAll('.nf-flat-button-primary')
		if(nxtButton != null && nxtButton != undefined)
		try {
			nxtButton[0].click();
		} catch(e) {
			console.debug(e);
		}
		if(nxtButton2 != null && nxtButton2 != undefined)
			try {
			nxtButton2[0].click();
			} catch(e) {
				console.debug(e);
			}
		if(skipsRemaining > 0)
		{
        		console.log("skipped the countdown for you " + skipsRemaining + " episode(s) remaining before stopping. ~ComfyFlix");
			skipsRemaining--;
			nxtButton = undefined
			nxtButton2 = undefined
		}
		else
		{
		console.log("Skipped Netflix countdown timer for you. \n <3 ComfyFlix");
		}

    	}
});
var observerConfig = {attributes: true,childList: true,subtree: true,characterData: false};
var targetNode = document.body;
setTimeout(function() {

    observer.observe(targetNode, observerConfig);
}, 10500);
  console.log('ComfyFlix is now active.');
