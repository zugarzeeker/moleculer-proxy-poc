const axios = require('axios');

const calleeUrl = process.env.CALLEE_URL || 'http://localhost:6001/hello';

const NAME = 'Caller';
const run = async () => {
  const { message } = await axios({
    url: calleeUrl,
    method: 'POST',
    data: {
      name: NAME,
    },
  }).then((response) => response.data);

  // test
  if (message === `Hi ${NAME}`) {
    console.log('test pass');
  } else {
    console.log('failed');
  }
};

run();
