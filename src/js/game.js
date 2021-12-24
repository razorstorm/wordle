import 'jquery';

$(document).ready(function () {
  let previousTime = null;
  let locPerCommit = [10, 50];
  let myLocPerCommit = [10, 50];
  let commits = 0;
  let loc = 0;
  let secondsPerCommit = 10.0;
  let clicksPerCommit = 10.0;
  let commitsPerClick = 1.0 / clicksPerCommit;
  let commitsPerSecond = 1.0 / secondsPerCommit;
  let commitsPerMillisecond = commitsPerSecond / 1000.0;
  let commitProgress = 0;
  let prevCommitLoc = 0;

  let myCommitProgress = 0;
  const locDisplay = $("#locDisplay");
  const commitsDisplay = $("#commitsDisplay");
  const prevCommitLocDisplay = $("#prevCommitLocDisplay");
  const commitProgressBar = $("#commitProgress");
  const myCommitProgressDisplay = $("#myCommitProgress");
  const secondsPerCommitDisplay = $("#secondsPerCommit");

  const makeCodeButton = $("#makeCodeButton");


  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const runFrame = () => {
    const currTime = new Date();
    if (previousTime === null) {
      previousTime = currTime;
      return;
    }
    const timeElapsed = currTime - previousTime;
    const commitIncrementalProgress = commitsPerMillisecond * timeElapsed;
    // console.log(timeElapsed, commitIncrementalProgress);
    commitProgress += commitIncrementalProgress;
    // console.log(commitProgress, commits, loc);
    if (commitProgress >= 1.0) {
      commitProgress -= 1.0;
      commits += 1;
      prevCommitLoc = getRandomInt(locPerCommit[0], locPerCommit[1]);
      loc += prevCommitLoc
    }

    updateData();
    previousTime = currTime;
  }

  const updateData = () => {
    locDisplay.text(loc);
    if (prevCommitLoc > 0) {
      prevCommitLocDisplay.text(" (+" + prevCommitLoc + ")");
    }
    commitsDisplay.text(commits);
    secondsPerCommitDisplay.text(secondsPerCommit);

    const commitProgressPercent = commitProgress * 100.0;
    commitProgressBar.css({
      width: commitProgressPercent + "%"
    });

    commitProgressBar.text(commitProgressPercent.toFixed(2) + "%");

    const myCommitProgressPercent = myCommitProgress * 100.0;
    myCommitProgressDisplay.css({
      width: myCommitProgressPercent + "%"
    });

    myCommitProgressDisplay.text(myCommitProgressPercent.toFixed(2) + "%");
  }

  window.makeCode = () => {
    myCommitProgress += commitsPerClick;
    if (myCommitProgress >= 1.0) {
      myCommitProgress -= 1.0;
      commits += 1;
      prevCommitLoc = getRandomInt(myLocPerCommit[0], myLocPerCommit[1]);
      loc += prevCommitLoc
    }
  }



  // makeCodeButton.click = makeCode;
  console.log(makeCodeButton);
  // 60 fps
  const gameClock = setInterval(runFrame, 1000 / 60.0);
});