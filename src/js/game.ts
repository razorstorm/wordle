import 'jquery';
import 'jquery-ui';
require('jquery-ui/ui/effects/effect-shake');

declare global {
  interface Window {
    toggleInstructions: Function;
  }
}

const toDict = (text: string): ({ [letter: string]: number }) => {
  let result: { [letter: string]: number } = {};
  const data = text.split('');

  data.forEach(letter => {
    result[letter] = data.filter(f => f === letter).length;
  });

  return result;
}

const subtractDicts = (first: { [letter: string]: number }, second: { [letter: string]: number }): { [letter: string]: number } => {
  let result: { [letter: string]: number } = {};

  Object.keys(first).forEach(letter => {
    const firstCount = first[letter];
    const secondCount = second[letter];
    if (!secondCount) {
      result[letter] = firstCount;
    } else {
      result[letter] = firstCount - secondCount;
    }
  });

  return result;
}

jQuery(function () {
  let currWord = "WOLDL";
  let currRow = $("#guessesContainer .row.empty").first();
  let currWordDict = toDict(currWord);
  let currGuess = "";
  let guesses = [];
  let instructionsShowing = true;
  let wordList = [];
  let wordSet: Set<string>;
  const instructions_text = $("#instructions_text");
  const toggle = $(".toggle");
  const keys = $(".keys");
  const doc = $(document);
  const alerts = $("#alerts");

  $.get(
    "words.txt",
    (data: string) => {
      wordList = data.toUpperCase().split("\n");
      wordSet = new Set(wordList);
      currWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
      currWordDict = toDict(currWord);
    },
  );

  const alertError = (error: string) => {
    const alert = $("<div class='row px-0 mb-3 justify-content-center'><div class='alert white bg-danger'>" + error + "</div></div>");
    alerts.append(alert);
    alert.delay(1000).fadeOut(400, function () {
      $(this).remove();
    });
  }

  const alertInvalidWord = () => {
    alertError("Word not found in wordlist!");
    currRow.effect("shake");
  }

  const removeLetter = () => {
    if (currGuess.length > 0) {
      currGuess = currGuess.substring(0, currGuess.length - 1);
      const currBox = currRow.children(".unchecked").last();
      currBox.text("");
      currBox.addClass("empty");
      currBox.removeClass("unchecked");
    }
  }

  const addLetter = (letter: string) => {
    if (currGuess.length < currWord.length) {
      currGuess += letter;
      const currBox = currRow.children(".empty").first();
      currBox.removeClass("empty");
      currBox.addClass("unchecked");

      currBox.append("<div class='border guess-box inner front'>" + letter + "</div>");
      currBox.append("<div class='border guess-box inner back'>" + letter + "</div>");
    }
  }

  const checkGuess = () => {
    if (currGuess.length != currWord.length) {
      return;
    }

    if (!wordSet.has(currGuess)) {
      alertInvalidWord();
      return;
    }

    let wordDict = $.extend({}, currWordDict);
    let results = Array.apply(null, Array(currWord.length)).map(function () { });
    // First figure out all the correct letters:
    for (let i = 0; i < currWord.length; i++) {
      const letter = currGuess[i];
      if (currGuess[i] === currWord[i]) {
        results[i] = "CORRECT";
        wordDict[letter]--;
      } else if (currWordDict[currGuess[i]] === undefined) {
        results[i] = "NOT FOUND";
      } else {
        results[i] = "WRONG LOCATION";
      }
    };

    // Iterate again and change the actual tiles
    for (let i = 0; i < currWord.length; i++) {
      const currBox = currRow.children(".unchecked").first();
      const currFront = currBox.children(".front");
      const currBack = currBox.children(".back");
      const letter = currGuess[i];
      const keyForLetter = $("#keys_" + letter);
      if (results[i] === "CORRECT") {
        results[i] = "CORRECT";
        currBack.addClass("bg-success white");
        keyForLetter.addClass("bg-success white");
      } else if (results[i] === "NOT FOUND") {
        currBack.addClass("bg-secondary white");
        keyForLetter.addClass("bg-secondary white");
      } else {
        const count = wordDict[letter];
        if (count > 0) {
          currBack.addClass("bg-warning white");
          keyForLetter.addClass("bg-warning white");
          wordDict[letter]--;
        } else {
          currBack.addClass("bg-secondary white");
          if (!keyForLetter.hasClass("white")) {
            keyForLetter.addClass("bg-secondary white");
          }
        }
      }
      currFront.addClass("back");
      currBack.removeClass("back");
      currBox.removeClass("unchecked");
    };

    guesses.push(currGuess);
    currGuess = "";
    currRow.removeClass("empty");
    currRow = $("#guessesContainer .row.empty").first();

    if (results.every((item: string) => item === "CORRECT")) {
      alert("GOOD JOB, PRESS REFRESH TO START AGAIN WITH NEW WORD");
      currRow = null;
    }
  }

  const isLetter = (text: string): boolean => {
    if (text.length !== 1) {
      return false;
    }
    return (/[a-zA-Z]/).test(text);
  }

  const processChar = (char: string) => {
    if (isLetter(char)) {
      addLetter(char);
    }

    if (char === "ENTER") {
      checkGuess();
    }

    if (char === "BACKSPACE") {
      removeLetter();
    }
  }

  doc.on('keyup', function (e) {
    const char = e.originalEvent.key.toUpperCase();
    processChar(char);
  });

  window.toggleInstructions = () => {
    if (instructionsShowing) {
      instructions_text.addClass("collapsed");
      toggle.addClass("rotated");
    } else {
      instructions_text.removeClass("collapsed");
      toggle.removeClass("rotated");
    }

    instructionsShowing = !instructionsShowing;
  }

  keys.on("click", e => {
    console.log($(e.currentTarget).attr("value"));
    processChar($(e.currentTarget).attr("value"));
  });
});
