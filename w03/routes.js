module.exports = {
  getRoot: (req, res) => {
    res.json({ status: 'ok', message: 'A szerver működik' });
  },

  getHealth: (serverStart) => (req, res) => {
    const uptime = Math.floor((Date.now() - serverStart) / 1000);
    res.json({ status: 'healthy', uptime });
  },

  getInfo: (req, res) => {
    res.json({ app: 'PRF gyakorlat', version: '1.0.0', author: '<hallgató neve>' });
  },

  getSlowCallback: (req, res) => {
    setTimeout(function() {
      res.json({ data: 'Ez 3 másodpercig tartott' });
    }, 3000);
  },

  getSlowPromise: (req, res) => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    }).then(() => {
      res.json({ data: 'Ez 3 másodpercig tartott (Promise)' });
    });
  },

  getSlowAsync: async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    res.json({ data: 'Ez 3 másodpercig tartott (async/await)' });
  },

  getSlowObservable: (Observable) => (req, res) => {
    const obs = new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next({ data: 'Ez 3 másodpercig tartott (Observable)' });
        subscriber.complete();
      }, 3000);
    });
    obs.subscribe({
      next: (data) => res.json(data)
    });
  },

  notFound: (req, res) => {
    res.status(404).json({ error: 'Az útvonal nem található' });
  }
};
