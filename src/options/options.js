
//////////////////////////// UI ///////////////////////////////////////
//                                                                   //
//   This function deals with options/index.html   //
//                        enables sleep mode view       //
//////////////////////////// END UI ///////////////////////////////////


document.getElementById('sleepModeCheck').addEventListener("click", function() {
	
	var sleepChildren = document.getElementById('sleepModeEnabled').children;
	if(document.getElementById('sleepModeCheck').checked)
	{

		for(var i = 0; i < sleepChildren.length; i++)
		{
			sleepChildren[i].style.display = "block";
		}
		//document.getElementById('skipNumberBox').style.display = "block";
	}
	else
	{
		for(var i = 0; i < sleepChildren.length; i++)
		{
			sleepChildren[i].style.display = "none";
		}
		chrome.storage.local.set({'counter' : 0}, function() {
		console.log("Sleep Mode Disabled");
		});
					document.getElementById('settingsSavedWindow').style.display="none";
		//document.getElementById('skipNumberBox').style.display = "none";
	}

});

//////////////////////////// LocalStorage /////////////////////////////
//                                                                   //
//         This function deals with storing skip counter             //
//                                                                   //
//////////////////////////// END UI ///////////////////////////////////


document.getElementById('saveOptions').addEventListener("click", function() {
		
		var skipCount = document.getElementById('skipNumberBox').value;
		
		if(skipCount > 0)
		{
			localStorage.setItem("counter", skipCount);
			chrome.storage.local.set({'counter' : skipCount}, function() {
			console.log("Settings Saved. Skipping " + skipCount + " episodes");
			});
			
			document.getElementById('settingsSavedWindow').style.display="block";
		}
		else
		{
			chrome.storage.local.set({'counter' : 0}, function() {
			console.log("Sleep Mode Disabled");
			});
		}
		
		
});




