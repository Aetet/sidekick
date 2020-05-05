export function getUserFromBE() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ name: "john doe" });
    }, (Math.random() % 10) * 100);
  });
}

function me() {
  let count = 0;

  function getUserInfo(timeout: number) {
    return new Promise(resolve => {
      const innerCount = ++count;

      getUserFromBE().then(a => {
        if (count === innerCount) {
          resolve(a);
        }
      });
    });
  }

  getUserInfo(100).then(a => {
    console.log("user1:", a);
  });

  getUserInfo(100).then(a => {
    console.log("user2:", a);
  });
}

me();
