const { Pool } = require("pg");
const { async } = require("regenerator-runtime");
const PG_URI =
  "postgres://edpseqvv:57Cak_X5WLgTW4eTLHyDW5jSjz7HTfKU@mahmud.db.elephantsql.com/edpseqvv";

const db = new Pool({ connectionString: PG_URI });

// const text1 = 'CREATE TABLE testname (_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, website VARCHAR NOT NULL UNIQUE, user_name VARCHAR, email VARCHAR NOT NULL, password VARCHAR NOT NULL);'
// const text = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
// const text = 'SELECT * FROM testname;'
// const [email, username, password, website] = ['test@thisDomainShouldNotExist.com', 'testname', 'testpassword', 'www.testwebsite2.com'];
// const text = 'INSERT INTO testname (website, user_name, password, email) VALUES ($1, $2, $3, $4) RETURNING *;'
// const values = [website, username, password, email];
// db.query(text, values).then(res => {'test:', console.log(res)});

describe("db unit test", () => {
  const [email, username, password] = [
    "test@thisDomainShouldNotExist.com",
    "testname",
    "testpassword",
  ];
  const [sitePassword, siteUsername, site] = [
    "testSitePassword",
    "testSiteUsername",
    "testSite",
  ];

  afterAll(async () => {
    db.end();
  });

  // tests for create new user
  describe("#create", () => {
    const text =
      "INSERT into users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *;";
    const values = [username, email, password];

    test("create a user profile in the database", async () => {
      const data = await db.query(text, values);
      expect(data).not.toBeInstanceOf(Error);
      expect(data.rows.length).toBe(1);
      expect(data.rows[0].user_name).toBe(username);
      expect(data.rows[0].email).toBe(email);
      expect(data.rows[0].password).toBe(password);
    });

    test("return an error when create another user profile with the same email", async () => {
      expect.assertions(1);
      try {
        await db.query(text, values);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  // test for read from db nad update info in db
  describe("#find/update", () => {
    test("return an error when query for userInfo table before any password is stored", async () => {
      const text = "SELECT * FROM testname;";
      expect.assertions(1);
      try {
        await db.query(text);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    test("create userInfo table for the first time", async () => {
      const text =
        "CREATE TABLE testname (_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, website VARCHAR NOT NULL UNIQUE, user_name VARCHAR, email VARCHAR NOT NULL, password VARCHAR NOT NULL);";
      const data = await db.query(text);
      expect(data).not.toBeInstanceOf(Error);
    });

    test("find a userInfo table in the database", async () => {
      const text = "SELECT * FROM testname;";
      const data = await db.query(text);
      expect(data).not.toBeInstanceOf(Error);
    });

    test("Add a website info for the user in the database", async () => {
      const text =
        "INSERT INTO testname (website, user_name, password, email) VALUES ($1, $2, $3, $4) RETURNING *;";
      const values = [site, siteUsername, sitePassword, email];
      const data = await db.query(text, values);
      expect(data).not.toBeInstanceOf(Error);
      expect(data.rows.length).toBe(1);
      expect(data.rows[0].website).toBe(site);
      expect(data.rows[0].user_name).toBe(siteUsername);
      expect(data.rows[0].email).toBe(email);
      expect(data.rows[0].password).toBe(sitePassword);
    });

    test("find a website info for the user in the database", async () => {
      const text = "SELECT * FROM testname WHERE website = $1;";
      const values = [site];
      const data = await db.query(text, values);
      expect(data).not.toBeInstanceOf(Error);
      expect(data.rows.length).toBe(1);
      expect(data.rows[0].website).toBe(site);
      expect(data.rows[0].user_name).toBe(siteUsername);
      expect(data.rows[0].email).toBe(email);
      expect(data.rows[0].password).toBe(sitePassword);
    });

    test("update the password and username for existed website", async () => {
      const [updatedPassword, updatedUsername] = [
        "UpdatedPassword",
        "UpdatedName",
      ];
      const text =
        "UPDATE testname SET password = $1, user_name = $2 WHERE website = $3 RETURNING *";
      const values = [updatedPassword, updatedUsername, site];
      const data = await db.query(text, values);
      expect(data).not.toBeInstanceOf(Error);
      expect(data.rows.length).toBe(1);
      expect(data.rows[0].website).toBe(site);
      expect(data.rows[0].user_name).toBe(updatedUsername);
      expect(data.rows[0].email).toBe(email);
      expect(data.rows[0].password).toBe(updatedPassword);
    });

    test("return an error when add another username and password for existing website", async () => {
      const text =
        "INSERT INTO testname (website, user_name, password, email) VALUES ($1, $2, $3, $4) RETURNING *;";
      const values = [site, siteUsername, sitePassword, email];
      expect.assertions(1);
      try {
        await db.query(text, values);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  // test for delete from user table and drop userinfo table
  describe("#drop/delete", () => {
    test("delete userInfo table for a user in the database", async () => {
      const text = "DROP TABLE testname;";
      const data = await db.query(text);
      expect(data).not.toBeInstanceOf(Error);
    });

    test("delete user profile in the database", async () => {
      const text = "DELETE FROM users WHERE email = $1 RETURNING *;";
      const values = [email];
      const data = await db.query(text, values);
      expect(data).not.toBeInstanceOf(Error);
      expect(data.rows.length).toBe(1);
      expect(data.rows[0].user_name).toBe(username);
      expect(data.rows[0].email).toBe(email);
      expect(data.rows[0].password).toBe(password);
    });
  });
});
