const SessionController = require("./session-ctrl");
const SessionService = require("../services/session-service");
const UserService = require("../services/user-service");
const Email = require("../utils/email-validator");

jest.mock("../services/session-service");
jest.mock("../services/user-service");
jest.mock("../utils/email-validator");

const mockEmail = "nonexistent@email.com";
const mockPassword = "senha123";

const req = {
  body: {
    email: mockEmail,
    password: mockPassword,
  },
};

describe("SessionController", () => {
  it("should return a token if email and password are valid", async () => {
    const req = {
      body: {
        email: "rodrigo@email.com",
        password: "senha123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const token = "token";
    Email.isValid.mockReturnValue(true);
    UserService.userExistsAndCheckPassword.mockResolvedValue(true);
    SessionService.generateToken.mockResolvedValue(token);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token });
  });

  it("should return 400 if email is invalid", async () => {
    const req = {
      body: {
        email: mockEmail,
        password: mockPassword,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Email.isValid.mockReturnValue(false);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email inválido" });
  });

  it("should return 400 if password is invalid", async () => {
    const req = {
      body: {
        email: mockEmail,
        password: mockPassword,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Email.isValid.mockReturnValue(true);
    UserService.userExistsAndCheckPassword.mockResolvedValue(false);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Senha inválida" });
  });

  it("should return 404 if user does not exist", async () => {
    const req = {
      body: {
        email: mockEmail,
        password: mockPassword,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Email.isValid.mockReturnValue(true);
    UserService.userExistsAndCheckPassword.mockResolvedValue(null);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
  });
});
