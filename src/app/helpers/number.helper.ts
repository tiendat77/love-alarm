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

function fix(value: number) {
  return value.toFixed(1).replace(/\.0$/, '');
}

export function abbreviate(value: number): string {
  const sign = value < 0 ? '-' : '';
  value = Math.abs(value);

  for (let i = 0; i < tier.length; i++) {
    if (value >= tier[i].value) {
      return `${sign}${fix((value / tier[i].value))}${tier[i].symbol}`;
    }
  }

  return value + '';
}

export function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default {
  random,
  abbreviate,
}
