const axios = require('axios');
const { join: joinPath } = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const ServiceName = process.env.CALLEE_SERVICE_NAME || process.env.SERVICE_NAME || 'Callee';
const PORT = process.env.CALLEE_PORT || process.env.PORT || 6001;
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: 'ok' });
});
app.post('/hello', (req, res) => {
  res.status(200).send({ message: `Hi ${req.body.name}` });
});

app.listen(PORT, () => {
  console.log('express app start at', PORT);
});

const { ServiceBroker } = require('moleculer');

// ======================================================
// Create a ServiceBroker
const broker = new ServiceBroker({
  nodeID: ServiceName + process.pid,
  transporter: 'NATS',
});

// Define a service
broker.createService({
  name: ServiceName,
  actions: {
    add(ctx) {
      return Number(ctx.params.a) + Number(ctx.params.b);
    },
    callPostRequest(ctx) {
      const { method, payload, path } = ctx.params;
      const url = 'http://' + joinPath('localhost:' + PORT, path);
      console.log({
        url,
        method,
        payload,
        path,
      });
      if (method === 'POST') {
        return axios({
          method: 'post',
          url,
          data: payload,
        })
          .then((response) => response.data)
          .catch(console.error);
      }
    },
  },
});

// Start the broker
broker
  .start()
  .then(() => broker.call(ServiceName + '.add', { a: 5, b: 3 }))
  .then((res) => console.log('5 + 3 =', res))
  .catch((err) => console.error(`Error occured! ${err.message}`));
