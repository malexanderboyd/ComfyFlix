async function watch() {
  if (window.location.href.includes("/watch/")) {
    let allButtons = document.querySelectorAll("button")
    for(let idx = 0; idx < allButtons.length; idx++) {
      const currButton = allButtons[idx];
      let skipped = false;
      if (currButton) {
          for(let j = 0; j < currButton.attributes.length; j++) {
            let attribute = currButton.attributes[j];
            if(attribute.specified) {
              if (attribute.value.toLocaleLowerCase() === "next-episode-seamless-button") {
                currButton.click()
                console.log("click")
                skipped = true;
                break;
              }
            }
          }
          if(skipped === true) {
            break;
          }
        }
      }
  }
}

window.setInterval(async () => {
  await watch();
}, 1000);
