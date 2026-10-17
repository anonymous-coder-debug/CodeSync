require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./sockets');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`[Server] CodeSync API + Socket.io running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('[Server] Unhandled rejection:', err);
});
