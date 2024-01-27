const UserService = require("./user-service");
const User = require("../schemas/User");

jest.mock("../schemas/User");

describe("UserService", () => {
  it("should create a user and return its id", async () => {
    const userData = {
      name: "Rodrigo",
      email: "rodrigo@email.com",
      password: "senha123",
    };
    const userId = "123";
    User.create.mockResolvedValue({ id: userId });

    const result = await UserService.createUser(userData);

    expect(User.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual({ id: userId });
  });
  it("should return false if user does not exist", async () => {
    const credentials = { email: "rodrigo@email.com", password: "senha123" };
    User.findOne.mockResolvedValue(null);

    const result = await UserService.userExistsAndCheckPassword(credentials);

    expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
    expect(result).toBe(false);
  });

  it("should throw an error if passwords do not match", async () => {
    const credentials = { email: "test@example.com", password: "password" };
    User.findOne.mockResolvedValue({
      email: credentials.email,
      password: "wrongpassword",
    });

    await expect(
      UserService.userExistsAndCheckPassword(credentials)
    ).rejects.toEqual({
      status: 400,
      message: "As senhas não batem",
    });
  });

  it("should return true if user exists and passwords match", async () => {
    const credentials = { email: "test@example.com", password: "password" };
    User.findOne.mockResolvedValue({
      email: credentials.email,
      password: credentials.password,
    });
    const result = await UserService.userExistsAndCheckPassword(credentials);

    expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
    expect(result).toBe(true);
  });
});
