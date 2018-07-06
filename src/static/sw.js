self.addEventListener('install', event => {
  console.log('Fix SW installed');
  event.waitUntil(
    caches
      .keys()
      .then(keys => {
        console.log('try to get cache keys', keys);
        return Promise.all(keys.map(key => caches.delete(key)));
      })
      .then(() => {
        console.log('Legacy caches has been deleted !');
      })
  );
});
