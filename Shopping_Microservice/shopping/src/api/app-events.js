const ShoppingService = require("../services/shopping-service");

module.exports = (app) => {
  const service = new ShoppingService();

  app.use("/app-events", async (req, res, next) => {
    // isteğin body kısmında gelen payload (veriye eriş)
    const { payload } = req.body;

    // subEvent ismindeki gelen payloada göre hangi kodların çalışıcağını belirlyen fonksiyonu çağır
    service.SubscribeEvents(payload);

    console.log("============ SHOPPING Servisi Bir Olay Yakaladı");
    return res.status(200).json(payload);
  });
};
