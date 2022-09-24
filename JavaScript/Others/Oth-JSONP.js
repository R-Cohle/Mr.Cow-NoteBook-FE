function JSONP({ url, params, callbackName }) {
  // 生成 url
  const generateUrl = () => {
    let dataSrc = '';
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        dataSrc += `${key}=${params[key]}&`;
      }
    }
    dataSrc += `callback=${callbackName}`;
    return `${url}?${dataSrc}`;
  };
  // 返回一个 Promise
  return new Promise((resolve, _) => {
    const scriptEle = document.createElement('script');
    scriptEle.src = generateUrl();
    document.body.appendChild(scriptEle);
    window[callbackName] = (data) => {
      resolve(data);
      document.removeChild(scriptEle);
    };
  });
}
