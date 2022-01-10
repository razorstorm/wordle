import 'jquery';
import Panels from './panels';
import Player from './player';
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
  let currWord = "GORGE";
  let currWordDict = toDict(currWord);
  let currRow = $("#guesses>.row:first-of-type");
  let currGuess = "";
  console.log(currRow);

  const doc = $(document);
  const makeGuess = (letter: string) => {
    if (currGuess.length < currWord.length) {
      currGuess += letter;
      const currBox = currRow.children(".empty").first();
      console.log(currBox);
      currBox.text(letter);
      currBox.removeClass("empty");
      currBox.addClass("unchecked");
    }
  }

  const checkGuess = () => {
    let wordDict = $.extend({}, currWordDict);
    let results = Array.apply(null, Array(currWord.length)).map(function () {});
    // First figure out all the correct letters:
    for(let i = 0; i < currWord.length; i++) {
      const letter = currGuess[i];
      if(currGuess[i] === currWord[i]) {
        results[i] = "CORRECT";
        wordDict[letter]--;
      } else if(currWordDict[currGuess[i]] === undefined) {
        results[i] = "NOT FOUND";
      } else {
        results[i] = "WRONG LOCATION";
      }
    };

    // Iterate again and change the actual tiles
    for(let i = 0; i < currWord.length; i++) {
      const currBox = currRow.children(".unchecked").first();
      if(results[i] === "CORRECT") {
        results[i] = "CORRECT";
        currBox.addClass("bg-success white");
      } else if(results[i] === "NOT FOUND") {
        currBox.addClass("bg-secondary white"); 
      } else {
        const letter = currGuess[i];
        const count = wordDict[letter];
        if(count > 0) {
          currBox.addClass("bg-warning white"); 
          wordDict[letter]--;
        } else {
          currBox.addClass("bg-secondary white"); 
        }
      }

      currBox.removeClass("unchecked");
    };
      // if (currWord[currGuess.length - 1] === letter) {
      //   currBox.addClass("bg-success"); // bg-secondary
      // } else {
      //   const currGuessDict = toDict(currGuess);
      //   console.log(currGuess, currGuessDict);
      //   const subtracted = subtractDicts(currWordDict, currGuessDict);
      //   console.log(subtracted);
      // }
  }

  const isLetter = (text: string): boolean => {
    if (text.length !== 1) {
      return false;
    }
    return (/[a-zA-Z]/).test(text);
  }

  doc.on('keyup', function (e) {
    const char = e.originalEvent.key.toUpperCase();
    console.log(char);
    console.log(isLetter(char));

    if (isLetter(char)) {
      makeGuess(char);
    }

    if(char === "ENTER") {
      checkGuess();
    }
  });
});