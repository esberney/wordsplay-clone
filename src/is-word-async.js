
export const isWordAsync = word => {

  // dummy check of validity -- todo: replace with call to server
  const isWordPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 2000);
  });

  return isWordPromise.
  then(isWord => {
    return {
      word,
      isWord
    }
  });
}
