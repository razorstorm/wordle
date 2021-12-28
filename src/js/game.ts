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
  let playerData = localStorage.getItem('player');
  let player: Player = new Player(JSON.parse(playerData));
  let previousTime: Date = null;
  let panels: Panels = new Panels();
  const framesPerSecond: number = 30.0;
  const secondsPerSave: number = 5;
  const gameStorage = window.localStorage;
  const log = $("#log");

  const runFrame = () => {
    const currTime = new Date();
    if (previousTime === null) {
      previousTime = currTime;
      return;
    }
    const timeElapsed: number = currTime.valueOf() - previousTime.valueOf();

    player.runFrame(timeElapsed);

    panels.updateData(player);
    previousTime = currTime;
  }

  const saveGame = () => {
    gameStorage.setItem('player', JSON.stringify(player));
    log.text(`Last saved at ${new Date()}`);
  }

  window.makeCode = () => {
    player.makeCode();
  }

  window.hireDev = () => {
    player.hireDev();
  }

  window.upgradeDev = () => {
    player.upgradeDev();
  }

  const gameClock = setInterval(runFrame, 1000 / framesPerSecond);
  const saveClock = setInterval(saveGame, secondsPerSave * 1000);
});