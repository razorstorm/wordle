import getRandomInt from "./misc/utils";
import Player from "./player";

// TODO: Refactor into separate classes for each of the panes
class Panels {
  locDisplay: JQuery;
  commitsDisplay: JQuery;
  developersDisplay: JQuery;
  prevCommitLocDisplay: JQuery;
  commitProgressBar: JQuery;
  myCommitProgressDisplay: JQuery;
  secondsPerCommitDisplay: JQuery;
  makeCodeButton: JQuery;
  hireDevsButton: JQuery;
  constructor() {
    this.locDisplay = $("#locDisplay");
    this.commitsDisplay = $("#commitsDisplay");
    this.developersDisplay = $("#developersDisplay");
    this.prevCommitLocDisplay = $("#prevCommitLocDisplay");
    this.commitProgressBar = $("#commitProgress");
    this.myCommitProgressDisplay = $("#myCommitProgress");
    this.secondsPerCommitDisplay = $("#secondsPerCommit");
    this.makeCodeButton = $("#makeCodeButton");
    this.hireDevsButton = $("#hireDevsButton");
  }


  updateData(player: Player) {
    this.locDisplay.text(player.loc);
    if (player.prevCommitLoc > 0) {
      this.prevCommitLocDisplay.text(" (+" + player.prevCommitLoc + ")");
    }
    this.commitsDisplay.text(player.commits);
    this.secondsPerCommitDisplay.text(player.secondsPerCommit);
    this.developersDisplay.text(player.developers);

    const commitProgressPercent = player.commitProgress * 100.0;
    this.commitProgressBar.css({
      width: commitProgressPercent + "%"
    });

    this.commitProgressBar.text(commitProgressPercent.toFixed(2) + "%");

    const myCommitProgressPercent = player.myCommitProgress * 100.0;
    this.myCommitProgressDisplay.css({
      width: myCommitProgressPercent + "%"
    });

    this.myCommitProgressDisplay.text(myCommitProgressPercent.toFixed(2) + "%");

    if(player.canHireDev()) {
      this.hireDevsButton.prop("disabled", false);
    } else {
      this.hireDevsButton.prop("disabled", true);
    }

    this.hireDevsButton.text(`Hire Developer (Cost: ${player.getDevCost()})`);
  }
}

export default Panels;