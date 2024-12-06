document.addEventListener("DOMContentLoaded", () => {
  const userInputArea = document.getElementById("user-input");
  const syntButton = document.getElementById("synt-button");
  const languageSelector = document.getElementById("lang-select");
  const pitchInp = document.getElementById("pitch");
  const volumeInp = document.getElementById("volume");
  const rateInp = document.getElementById("rate");

  userInputArea.value = "";
  for (let entry of responsiveVoice.getVoices()) {
    const tempElement = document.createElement("option");
    tempElement.textContent = entry.name;
    tempElement.value = entry.name;
    languageSelector.appendChild(tempElement);
    console.log(entry.name);
  }
  syntButton.addEventListener("click", () => {
    if (!responsiveVoice.isPlaying()) {
      console.log("Already in use");
      responsiveVoice.cancel();
      responsiveVoice.speak(userInputArea.value, languageSelector.value, {
        pitch: pitchInp.value ? pitchInp.value / 50 : 0,
        volume: volumeInp.value ? volumeInp.value / 100 : 1,
        rate: rateInp.value ? (rateInp.value / 200) * 3 : 1,
      });
      console.log(languageSelector.value);
    } else {
      responsiveVoice.speak(userInputArea.value, languageSelector.value, {
        pitch: pitchInp.value ? pitchInp.value / 50 : 0,
        volume: volumeInp.value ? volumeInp.value / 100 : 1,
        rate: rateInp.value ? (rateInp.value / 200) * 3 : 1,
      });
      console.log(languageSelector.value);
    }
  });
});
