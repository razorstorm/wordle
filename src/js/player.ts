import { GameUtils } from './gameUtils';

// StackOverFlow upgrade. Click to toggle whether to use SO, when using, have chance of reducing time between commits, but might lead to a 0 star commit due to "IM NOT ANSWERING YOUR QUESTION YOUR APPROACH IS BAD GO AND REWRITE YOUR ENTIRE COMPANY'S 100 GB CODE BASE TO USE MY APPROACH THATS MARGINALLY BETTER, etc"
interface PlayerData {
    stars: number;
    prestigeBonus: number;
    commitUpgradeLevel: number;
    devs: number;
}

class Player {
    stars: number;
    prestigeBonus: number;
    // by default one commit makes one star
    commitUpgradeLevel: number;
    devs: number;
    devLevel: number;
    useSO: boolean;
    locPerCommit: number[];
    myLocPerCommit: number[];
    commits: number;
    loc:number;
    secondsPerCommit:number;
    clicksPerCommit:number;
    commitsPerClick:number;
    commitsPerSecond:number;
    commitsPerMillisecond:number;
    commitProgress:number;
    prevCommitLoc:number;
    developers:number;
    developerCost:number;

    constructor() {
        this.stars = 0;
        this.prestigeBonus = 0;
        this.commitUpgradeLevel = 1;
        this.devs = 0;
        this.devLevel = 0;
        this.useSO = false;
        this.locPerCommit = [10, 50];
        this.myLocPerCommit = [10, 50];
        this.commits = 0;
        this.loc = 0;
        this.secondsPerCommit = 10.0;
        this.clicksPerCommit = 10.0;
        this.commitsPerClick = 1.0 / this.clicksPerCommit;
        this.commitsPerSecond = 1.0 / this.secondsPerCommit;
        this.commitsPerMillisecond = this.commitsPerSecond / 1000.0;
        this.commitProgress = 0;
        this.prevCommitLoc = 0;
        this.developers = 1;
        this.developerCost = 300;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    deserialize(data: string) {
        const playerData: PlayerData = JSON.parse(data);
        Object.assign(this, playerData);
    }

    loadFromSave(): Player {
        // todo deserialize
        return new Player();
    }

    loseStars(amount: number) {
        this.stars -= amount;
        this.stars = Math.max(0, this.stars);
    }

    getDevCost(): number {
        return GameUtils.devCostScaling(this.devs);
    }

    getDevLevelCost(): number {
        return GameUtils.devLevelCostScaling(this.devLevel);
    }

    canBuyDev() {
        return this.stars >= this.getDevCost();
    }

    buyDev() {
        if (this.canBuyDev()) {
            const cost = this.getDevCost();
            this.loseStars(cost);
            this.devs += 1;
        }
    }

    canBuyDevLevel() {
        return this.stars >= this.getDevLevelCost();
    }

    buyDevLevel() {
        if (this.canBuyDevLevel()) {
            const cost = this.getDevLevelCost();
            this.loseStars(cost);
            this.devLevel += 1;
        }
    }

    msPerDev() {
        return GameUtils.devTimeScaling(this.devs);
    }

    starPerDev() {
        return GameUtils.devStarScaling(this.devLevel);
    }

    getCommitUpgradeCost(): number {
        return GameUtils.commitUpgradeCostScaling(this.commitUpgradeLevel);
    }

    canBuyCommitUpgrade() {
        return this.stars >= this.getCommitUpgradeCost();
    }

    buyCommitUpgrade() {
        if (this.canBuyCommitUpgrade()) {
            const cost = this.getCommitUpgradeCost();
            this.loseStars(cost);
            this.commitUpgradeLevel += 1;
        }
    }

    starsPerCommit(): number {
        return GameUtils.commitUpgradeMultiplierScaling(this.commitUpgradeLevel);
    }

    makeCommit() {
        const starsToGain = this.starsPerCommit();
        this.gainStars(starsToGain);
        console.log(starsToGain, this.stars);
    }

    gainStars(stars: number) {
        let multiplier = 1;
        if (this.useSO) {
            multiplier = Math.random() * 8 - 4
        }
        this.stars += stars * multiplier;
        this.stars = Math.max(0, this.stars);
    }

    toggleStackOverflow() {
        this.useSO = !this.useSO;
    }
}

export default Player;