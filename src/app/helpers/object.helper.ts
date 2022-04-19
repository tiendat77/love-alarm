export function transformArray2Object(array: any[]) {
  const result = {};
  array.forEach(item => {
    result[item.id] = item.value;
  });
  return result;
}

export default {
  transformArray2Object
}