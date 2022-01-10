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

jQuery(function () {
  let currRow = $("#guesses>.row:first-of-type");
  let currGuess = "";
  console.log(currRow);

  const doc = $(document);
  const makeGuess = (letter: string) => {
    currGuess += letter;
    const currBox = currRow.children(".empty").first();
    console.log(currBox);
    currBox.text(letter);
    currBox.removeClass("empty");
  }

  const isLetter = (text: string): boolean => {
    if(text.length !== 1) {
      return false;
    }
    return (/[a-zA-Z]/).test(text);
  }

  doc.on('keyup', function (e) {
    const char = e.originalEvent.key.toUpperCase();
    console.log(char);
    console.log(isLetter(char));

    if(isLetter(char)) {
      makeGuess(char);
    }
  });
});