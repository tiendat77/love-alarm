const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export class NanoIdHelper {
  static pool = Array();

  static fillPool(size: number = 21) {
    if (!NanoIdHelper.pool || !NanoIdHelper.pool.length) {
      NanoIdHelper.pool = Array(size * 128).fill(0);
      this.randomFill(NanoIdHelper.pool);
    }
  }

  static randomFill(array: number[]) {
    array.forEach((_, i) => {
      array[i] = Math.floor(Math.random() * array.length);
    });
  }

  static nanoid(size = 21) {
    this.fillPool();
    this.randomFill(NanoIdHelper.pool);

    let id = '';
    for (let i = 0; i < size; i++) {
      id += urlAlphabet[NanoIdHelper.pool[i] & 63];
    }

    return id;
  }
}