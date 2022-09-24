function shuffle(arr) {
  for (let len = arr.length, i = len - 1; i > 0; --i) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }

  return arr;
}
