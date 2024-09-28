const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  // kanal oluştur

  // expressApp fonksiyonuna kanalı gönder
  const channel = await CreateChannel();

  await expressApp(app, channel);

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log("HATA>>>>>><", err);
      process.exit();
    });
};

StartServer();
