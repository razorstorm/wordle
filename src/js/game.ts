import 'jquery';
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
  console.log(currRow);
  const doc = $(document);

  $.get(
    "words.txt",
    (data: string) => {
      let wordList = data.split("\n");
      currWord = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
      currWordDict = toDict(currWord);
      // console.log(currWord);
    },
  );

  const removeLetter = () => {
    if (currGuess.length > 0) {
      currGuess = currGuess.substring(0, currGuess.length - 1);
      const currBox = currRow.children(".unchecked").last();
      currBox.text("");
      currBox.addClass("empty");
      currBox.removeClass("unchecked");
      console.log(currGuess);
    }
  }

  const addLetter = (letter: string) => {
    console.log(currWord);
    if (currGuess.length < currWord.length) {
      currGuess += letter;
      console.log(currGuess);
      const currBox = currRow.children(".empty").first();
      console.log(currRow, currBox);
      // currBox.text(letter);
      currBox.removeClass("empty");
      currBox.addClass("unchecked");

      currBox.append("<div class='border guess-box inner front'>"+letter+"</div>");
      currBox.append("<div class='border guess-box inner back'>"+letter+"</div>");
    }
  }

  const checkGuess = () => {
    // TODO only allow check if guess is a valid word
    if (currGuess.length != currWord.length) {
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
      if (results[i] === "CORRECT") {
        results[i] = "CORRECT";
        currBack.addClass("bg-success white");
      } else if (results[i] === "NOT FOUND") {
        currBack.addClass("bg-secondary white");
      } else {
        const letter = currGuess[i];
        const count = wordDict[letter];
        if (count > 0) {
          currBack.addClass("bg-warning white");
          wordDict[letter]--;
        } else {
          currBack.addClass("bg-secondary white");
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

    if(results.every((item: string) => item === "CORRECT")) {
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

  doc.on('keyup', function (e) {
    const char = e.originalEvent.key.toUpperCase();

    if (isLetter(char)) {
      addLetter(char);
    }

    if (char === "ENTER") {
      checkGuess();
    }

    if (char === "BACKSPACE") {
      removeLetter();
    }
  });

  window.toggleInstructions = () => {
    if(instructionsShowing) {
      $("#instructions_text").addClass("collapsed");
      $(".toggle").addClass("rotated");
    } else {
      $("#instructions_text").removeClass("collapsed");
      $(".toggle").removeClass("rotated");
    }

    instructionsShowing = !instructionsShowing;
  }
});
