const axios = require('axios');

const calleeUrl = process.env.CALLEE_URL || 'http://localhost:6001/hello';

const ServiceName = process.env.CALLER_SERVICE_NAME || process.env.SERVICE_NAME || 'Caller';

const run = async () => {
  const { message } = await axios({
    url: calleeUrl,
    method: 'POST',
    data: {
      name: ServiceName,
    },
  }).then((response) => response.data);

  // test
  if (message === `Hi ${ServiceName}`) {
    console.log('test pass');
  } else {
    console.log('failed');
  }
};

run();
