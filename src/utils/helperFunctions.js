export const deleteFromList = (list, key, id, update) => {
  const newList = list[key].filter((item) => item._id !== id);
  list[key] = newList;
  update(list);
};
export const getTrimedString = (str, len = 50) => {
  if (str?.length > len) {
    return { content: str.substring(0, len), isTrimed: true };
  }
  return { content: str, isTrimed: false };
};
