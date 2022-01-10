import 'jquery';
declare global {
  interface Window {
    hireDev: Function;
    makeCode: Function;
    upgradeDev: Function;
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
  let currRow = $("#guesses>.empty").first();
  let currWordDict = toDict(currWord);
  let currGuess = "";
  let guesses = [];
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
      const currBox = currRow.children(".empty").first();
      currBox.text(letter);
      currBox.removeClass("empty");
      currBox.addClass("unchecked");
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
      if (results[i] === "CORRECT") {
        results[i] = "CORRECT";
        currBox.addClass("bg-success white");
      } else if (results[i] === "NOT FOUND") {
        currBox.addClass("bg-secondary white");
      } else {
        const letter = currGuess[i];
        const count = wordDict[letter];
        if (count > 0) {
          currBox.addClass("bg-warning white");
          wordDict[letter]--;
        } else {
          currBox.addClass("bg-secondary white");
        }
      }
      currBox.removeClass("unchecked");
    };

    guesses.push(currGuess);
    currGuess = "";
    currRow.removeClass("empty");
    currRow = $("#guesses>.empty").first();

    if(results.every((item: string) => item === "CORRECT")) {
      alert("GOOD JOB, PRESS REFRESH TO START AGAIN WITH NEW WORD");
      currRow = null;
    }
  }
  // yes

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
});