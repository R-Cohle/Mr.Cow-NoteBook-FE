function red() {
  console.log("red light");
}
function green() {
  console.log("green light");
}
function yellow() {
  console.log("yellow light");
}

auto();

function light(duration, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, duration * 1000);
  });
}

function auto() {
  return Promise.resolve()
    .then(() => {
      return light(3, red);
    })
    .then(() => {
      return light(2, green);
    })
    .then(() => {
      return light(1, yellow);
    })
    .then(() => {
      auto();
    });
}
