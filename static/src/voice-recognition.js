document.addEventListener("DOMContentLoaded", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Sorry, your browser does not support speech recognition.");
  } else {
    const startStopButton = document.getElementById("listen-button");
    const resultBox = document.getElementById("text-recogntion-output");
    const languageSelector = document.getElementById("lang-select");

    const recognitionLangInp = document.getElementById(
      "recognition-lang-selector"
    );
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    var isListening = false;
    recognition.lang = recognitionLangInp.value; // Language
    recognition.interimResults = false; // Recognize interim results (optional)
    recognition.continuous = true; // Continuous listening (optional)

    recognition.onresult = async (event) => {
      resultBox.textContent = event.results[event.resultIndex][0].transcript;
      const commandResponce = await fetch(
        "/command?command=" + event.results[event.resultIndex][0].transcript
      );
      const commandData = await commandResponce.json();
      console.log(commandData, languageSelector.value);
      switch (commandData.command) {
        case "say":
          responsiveVoice.speak(
            commandData.pointer.join(" "),
            languageSelector.value
          );
          break;
        case "open":
          if (commandData.pointer[0] === "music")
            window.open("https://open.spotify.com/", "_blank");
          else if (commandData.pointer[0] === "video")
            window.open("https://www.youtube.com/", "_blank");
          break;
        case "find":
          window.open(
            "https://www.google.com/search?q=" + commandData.pointer,
            "_blank"
          );
          break;
        case "message":
          alert(commandData.pointer.join(" "));
      }
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
    };
    startStopButton.addEventListener("click", () => {
      if (!isListening) {
        recognition.lang = recognitionLangInp.value;
        recognition.start();
        startStopButton.textContent = "Стоп";
        isListening = true;
        resultBox.textContent = "";
      } else {
        recognition.stop();
        startStopButton.textContent = "Слушать";
        isListening = false;
      }
    });
  }
});
