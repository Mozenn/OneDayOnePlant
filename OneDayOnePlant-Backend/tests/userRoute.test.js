const mongoose = require("mongoose");
const Plant = require("../src/models/plant");
const User = require("../src/models/user");
const app = require("../src/app");
const request = require("supertest");
const authenticationService = require("../services/authenticationService");

describe("User Routes", () => {
  beforeAll(async () => {
    await mongoose
      .set("useUnifiedTopology", true)
      .connect(process.env.DB_URL, { useNewUrlParser: true });
  });

  beforeEach(async () => {
    await User.deleteMany({}).exec();
  });

  test("should respond with statusCode 201 when signing up with valid credentials", (done) => {
    request(app)
      .post("/signup")
      .send({
        username: "hey",
        email: "ho@gmail.com",
        password: "passwordnobody",
      })
      .expect(201, done);
  });

  test("should respond with statusCode 422 when trying to signup with existing email", async (done) => {
    const username = "hey";
    const email = "ho@gmail.com";
    const password = "hy";

    await authenticationService.signupUser(username, email, password);

    request(app)
      .post("/signup")
      .send({
        username: "hey",
        email: "ho@gmail.com",
        password: "passwordnobody",
      })
      .expect(422, done);
  });

  // TODO rewrite test once email confirmation feature done
  // test("should respond with statusCode 200 when login in with valid credentials", async (done) => {
  //   const username = "hey";
  //   const email = "ho@gmail.com";
  //   const password = "passwordnobody";

  //   await authenticationService.signupUser(username, email, password);

  //   request(app)
  //     .post("/login")
  //     .send({
  //       username: "hey",
  //       password: "passwordnobody",
  //     })
  //     .expect(200, done);
  // });

  test("should respond with statusCode 401 when trying to login with wrong credentials", (done) => {
    request(app)
      .post("/login")
      .send({
        username: "hey",
        password: "passwordnobodi",
      })
      .expect(401, done);
  });

  test("should respond with statusCode 200 when fetching a valid user", async (done) => {
    const username = "hey";
    const email = "ho@gmail.com";
    const password = "passwordnobody";

    const res = await authenticationService.signupUser(
      username,
      email,
      password
    );

    request(app)
      .get(`/user/${res.user._id.toString()}`)
      .set("Authorization", "Bearer " + res.token)
      .expect(200, done);
  });

  afterAll(async () => {
    await User.deleteMany({}).exec();
    await Plant.deleteMany({}).exec();
    await mongoose.disconnect();
  });
});
