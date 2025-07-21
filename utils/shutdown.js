let serverRef;

const setServer = (srv) => {
  serverRef = srv;
};

const shuttingDownServer = (message, err) => {
  console.log(`--------------------------------------`);
  console.log(message);
  console.log(`--------------------------------------`);
  console.log(err.name, err.message);
  console.log(`--------------------------------------`);
  console.log(`⚠ The process is shutting down... ⚠`);
  console.log(`--------------------------------------`);

  if (serverRef) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

module.exports = { shuttingDownServer, setServer };
