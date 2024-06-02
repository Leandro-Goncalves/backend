export const arrayToObject = <T extends string[]>(array: T, value: any) => {
  const result = {};
  array.forEach((item) => {
    const keys = item.split('.');
    let currentLevel = result;

    keys.forEach((key, index) => {
      if (!currentLevel[key]) {
        currentLevel[key] = index === keys.length - 1 ? value : {};
      }
      currentLevel = currentLevel[key];
    });
  });

  return result;
};
