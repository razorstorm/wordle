export class GameUtils {
  static commitUpgradeCostScaling(currLevel: number): number {
      return Math.ceil(2 ** currLevel);
  }

  static commitUpgradeMultiplierScaling(currLevel: number): number {
      return Math.ceil(1.4 ** (currLevel - 1));
  }

  static devCostScaling(currLevel: number): number {
      return Math.ceil(2 ** currLevel + 1.5 * currLevel + 100);
      // return 1;
  }

  static devLevelCostScaling(currLevel: number): number {
      return Math.ceil(2 ** currLevel + 1.5 * currLevel + 100);
  }

  static devTimeScaling(currLevel: number): number {
      return 10 * 1000 / currLevel;
  }

  static devStarScaling(currLevel: number): number {
      // return Math.ceil(1.4 ** (currLevel - 1));
      if (currLevel < 1) {
          return 0;
      }
      return Math.log(currLevel + 1) / Math.log(1.1);
      // return Math.log(currLevel);
  }
}

export default GameUtils;