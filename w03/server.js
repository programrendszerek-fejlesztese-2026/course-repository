const express = require('express');
const { Observable } = require('rxjs');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
const serverStart = Date.now();

app.get('/', routes.getRoot);
app.get('/health', routes.getHealth(serverStart));
app.get('/info', routes.getInfo);
app.get('/slow', routes.getSlowCallback);
app.get('/slow-promise', routes.getSlowPromise);
app.get('/slow-async', routes.getSlowAsync);
app.get('/slow-observable', routes.getSlowObservable(Observable));

app.use(routes.notFound);

app.listen(PORT, () => {
  console.log(`A szerver a ${PORT}-es porton fut.`);
});
