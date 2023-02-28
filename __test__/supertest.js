const request = require("supertest");
const server = "http://localhost:3000";

// tests for server
describe("Test the route integration", () => {
  // tests on the root route
  describe("/", () => {
    test("get request will respond with 200 and text/html content type", () => {
      return request(server)
        .get("/")
        .expect("Content-Type", /text\/html/)
        .expect(200);
    });

    test("get bundle.js will respond with 200 and application/javascript content type", () => {
      return request(server)
        .get("/bundle.js")
        .expect("Content-Type", /application\/javascript/)
        .expect(200);
    });
  });

  // tests on '/sigup' route
  describe("/signup", () => {
    const signupData = {
      email: "testemail",
      username: "testname",
      password: "testpsd",
    };
    test("response with 200 status and json content type", () => {
      return request(server)
        .post("/signup")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    });

    test("responds with the created username and id ", () => {
      return request(server)
        .post("/signup")
        .send(signupData)
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(Object.hasOwn(res.body, "username").toBe(true));
          expect(Object.hasOwn(res.body, "id").toBe(true));
        })
        .expect(200);
    });

    test("responds to invalid request with 400 status and error message in body", () => {
      const notObj = [1, 2, 3];

      return request(server)
        .post("/signup")
        .send(notObj)
        .expect("Content-Type", /application\/json/)
        .expect((res) => expect(Object.hasOwn(res.body, "error").toBe(true)))
        .expect(400);
    });
  });
});
