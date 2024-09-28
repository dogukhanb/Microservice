module.exports = (app) => {
  app.use("/app-events", async (req, res, next) => {
    // isteğin body kısmında gelen payload (veriye eriş)
    const { payload } = req.body;

    console.log("============ Products Servisi Bir Olay Yakaladı");
    return res.status(200).json(payload);
  });
};
