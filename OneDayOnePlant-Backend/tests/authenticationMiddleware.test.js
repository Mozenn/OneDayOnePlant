const authenticationMiddleware = require("../src/middlewares/authenticationMiddleware");

describe("Authentication Middleware", () => {
  test("should throw an error if no authorization header is present", () => {
    const req = {
      get: () => {
        return null;
      },
    };

    expect(() => {
      authenticationMiddleware(req, {}, () => { });
    }).toThrow();
  });

  test("should throw an error if token cannot be verified", () => {
    const req = {
      get: () => {
        return "Bearer 1205g";
      },
    };

    try {
      authenticationMiddleware(req, {}, () => { });
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.statusCode).toBe(500);
    }
  });
});
