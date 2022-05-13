const tier = [
  {
    value: 1000000000,
    symbol: 'G'
  },
  {
    value: 1000000,
    symbol: 'M'
  },
  {
    value: 1000,
    symbol: 'K'
  }
];

export class NumberHelper {
  static random(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  static abbreviate(value: number): string {
    const sign = value < 0 ? '-' : '';
    value = Math.abs(value);

    for (let i = 0; i < tier.length; i++) {
      if (value >= tier[i].value) {
        const fixed = (value / tier[i].value).toFixed(1).replace(/\.0$/, '');
        return `${sign}${fixed}${tier[i].symbol}`;
      }
    }

    return value + '';
  }
}