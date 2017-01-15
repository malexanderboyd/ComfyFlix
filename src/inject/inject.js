

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
    isItTwo = document.querySelectorAll('.player-postplay');
 	if(isItTwo.length && skipsRemaining == 0 && sleepMode == true)
	{
		console.log("Skipped desired number of episodes. Redirecting to homepage... ~ComfyFlix");
		window.location = "https://netflix.com/";
		throw new Error("Stopping ComfyFlix.");
	}
    	else if (isItTwo.length && skipsRemaining >= 0)
	{
        	var nxtButton = document.querySelectorAll('.player-postplay-show-autoplay > div')
		nxtButton[0].click();
		if(skipsRemaining > 0)
		{
        		console.log("skipped the countdown for you " + skipsRemaining + " episode(s) remaining before stopping. ~ComfyFlix");
			skipsRemaining--;
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