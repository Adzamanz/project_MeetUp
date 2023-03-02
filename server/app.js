const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());



const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
