const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const leaveRequestRouter = require('./routes/leaveHistory');

dotenv.config();
app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('database connected'))
  .catch(err => console.error(' database connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express + MongoDB!');
});
app.use('/user',userRouter);
app.use('/leaves',leaveRequestRouter)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`app is listning on port ${PORT}`));