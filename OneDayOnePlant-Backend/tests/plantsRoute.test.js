const mongoose = require("mongoose");
const plantsController = require("../src/controllers/plantsController");
const Plant = require("../src/models/plant");
const User = require("../src/models/user");
const app = require("../src/app");
const request = require("supertest");
const authenticationService = require("../src/services/authenticationService");

describe("Plants Controller", () => {
  let plant = "";
  let token = "";
  let user = null;

  beforeAll(async () => {
    await mongoose
      .set("useUnifiedTopology", true)
      .connect(process.env.DB_URL, { useNewUrlParser: true });
  });

  beforeEach(async () => {
    await Plant.deleteMany({}).exec();
    await User.deleteMany({}).exec();

    const plantTemp = new Plant({
      name: "testPlant",
      url: "placeHolder",
      imageUrl: "PlaceHolder as well",
    });

    plant = await plantTemp.save();

    const username = "hey";
    const email = "ho@gmail.com";
    const password = "hy";

    const res = await authenticationService.signupUser(
      username,
      email,
      password
    );

    token = res.token;
    user = res.user;
  });

  test("should throw an error with statusCode 404 if plant not contained in DB", (done) => {
    request(app)
      .get("/plant/200000000000")
      .set("Authorization", "Bearer " + token)
      .expect(404, done);
  });

  test("should respond with statusCode 200 and return plant when querying a valid plant", (done) => {
    request(app)
      .get(`/plant/${plant._id.toString()}`)
      .set("Authorization", "Bearer " + token)
      .expect(200, done);
  });

  test("should respond with statusCode 200 and return all plants when querying plants", (done) => {
    request(app)
      .get("/plants")
      .set("Authorization", "Bearer " + token)
      .expect(200, done);
  });

  test("should respond with statusCode 200 and return random plant when drawing a plant", (done) => {
    request(app)
      .get("/draw")
      .set("Authorization", "Bearer " + token)
      .expect(200, done);
  });

  test("should respond with statusCode 403 when trying to draw a plant and timer not reset", async (done) => {
    await User.updateOne(
      { username: "hey" },
      { $set: { lastDrawDate: new Date() } }
    ).exec();

    request(app)
      .get("/draw")
      .set("Authorization", "Bearer " + token)
      .expect(403, done);
  });

  afterAll(async () => {
    await User.deleteMany({}).exec();
    await Plant.deleteMany({}).exec();
    await mongoose.disconnect();
  });
});
