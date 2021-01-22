const express = require('express');
const bodyParser = require('body-parser');

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
