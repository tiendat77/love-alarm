const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

let pool = Array();

function fillPool(size: number = 21) {
  if (!pool || !pool.length) {
    pool = Array(size * 128).fill(0);
    randomFill(pool);
  }
}

function randomFill(array: number[]) {
  array.forEach((_, i) => {
    array[i] = Math.floor(Math.random() * array.length);
  });
}

export function nanoid(size = 21) {
  fillPool();
  randomFill(pool);

  let id = '';
  for (let i = 0; i < size; i++) {
    id += urlAlphabet[pool[i] & 63];
  }

  return id;
}

export default { nanoid }
