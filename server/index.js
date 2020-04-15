const express = require('express');
const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
})

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening at http://localhost:${PORT}`);
});