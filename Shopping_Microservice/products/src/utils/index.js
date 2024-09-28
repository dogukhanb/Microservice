const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const { APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

/*---------------* Message Broker Kurulum *-------------------*/

// kanal oluştur
module.exports.CreateChannel = async () => {
  try {
    // RabbitMQ'ya bir bağlantı oluşturur
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    // Bir kanal oluşturur
    const channel = await connection.createChannel();
    // Kuyruğu ayarla
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    // Kanalı döner
    return channel;
  } catch (err) {
    throw err;
  }
};

// mesaj yayınla
module.exports.PublishMessage = async (channel, service, message) => {
  try {
    // mesajı kanalda yayınlar
    await channel.publish(EXCHANGE_NAME, service, Buffer.from(message));
    console.log("Mesaj Gönderildi 🤩", message);
  } catch (err) {
    throw err;
  }
};

// mesajlara abone ol
module.exports.SubscribeMessage = async (channel, service, binding_key) => {
  // Geçici ve benzersiz bir kuyruk oluşturur
  const appQueue = await channel.assertQueue(QUEUE_NAME);

  // Kuyruğu belirli bir routing keye bağlar
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);

  // Kuyruktaki mesajları al
  channel.consume(appQueue.queue, (data) => {
    console.log("kuyruktaki veri alındı 🙂");
    console.log(data.content.toString());
    channel.ack(data);
  });
};
