async () => {
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("fetched data");
      }, 1000);
    });
  };

  const awaitWrap = (promise) => {
    return promise.then((data) => [null, data]).catch((err) => [err, null]);
  };

  const [err, data] = await awaitWrap(fetchData());
  console.log("err: ", err);
  console.log("data: ", data);
};
