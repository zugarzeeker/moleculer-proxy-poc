const { ServiceBroker } = require('moleculer');

const calleeUrl = process.env.CALLEE_URL || 'http://localhost:6001/hello';

const ServiceName = process.env.CALLER_SERVICE_NAME || process.env.SERVICE_NAME || 'Caller__';
// Create a ServiceBroker
const broker = new ServiceBroker({
  nodeID: ServiceName + process.pid,
  transporter: 'NATS',
});

// Define a service
broker.createService({
  name: ServiceName,
});

// Start the broker
broker
  .start()
  .then(() => broker.call('Callee.add', { a: 5, b: 3 }))
  .then((res) => console.log('5 + 3 =', res))
  .catch((err) => console.error(`Error occured! ${err.message}`))
  .then(async () => {
    // !!!!!!
    const result = await broker.call('Callee.callPostRequest', {
      payload: { name: 'A' },
      path: '/hello',
      method: 'POST',
    });
    console.log({
      result,
    });
  });
// //   // Print the response
// //   .catch((err) => console.error(`Error occured! ${err.message}`));
