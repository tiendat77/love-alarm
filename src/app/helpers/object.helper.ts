
export class ObjectHelper {
  static transformArray2Object(array: any[]) {
    const result = {};
    array.forEach(item => {
      result[item.id] = item.value;
    });
    return result;
  }
}
