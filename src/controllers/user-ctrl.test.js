const request = require("supertest");
const UserController = require("../controllers/user-ctrl");
const UserService = require("../services/user-service");
const Email = require("../utils/email-validator");

jest.mock("../services/user-service");
jest.mock("../utils/email-validator");

describe("UserController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      userEmail: "",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if email is invalid", async () => {
    Email.isValid = jest.fn().mockReturnValue(false);
    req.body = { name: "name", email: "invalid", password: "password" };

    await UserController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email inválido" });
  });

  it("should return 400 if password is not provided", async () => {
    Email.isValid = jest.fn().mockReturnValue(true);
    req.body = { name: "name", email: "email", password: "" };

    await UserController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Senha inválida" });
  });

  it("should return 200 and user id if user is created successfully", async () => {
    Email.isValid = jest.fn().mockReturnValue(true);
    UserService.createUser = jest.fn().mockResolvedValue({ id: 1 });
    req.body = { name: "name", email: "email", password: "password" };

    await UserController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it("should return 200 and a message", async () => {
    req.userEmail = "email";

    await UserController.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  });
});
