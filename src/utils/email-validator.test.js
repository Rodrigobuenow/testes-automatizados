const Email = require("./email-validator");

describe("Email", () => {
  test("should return false for empty email", () => {
    expect(Email.isValid("")).toBe(false);
  });

  test("should return false for null email", () => {
    expect(Email.isValid(null)).toBe(false);
  });

  test("should return false for email without @", () => {
    expect(Email.isValid("emailwithoutat.com")).toBe(false);
  });

  test("should return false for email without domain", () => {
    expect(Email.isValid("email@")).toBe(false);
  });

  test("should return false for email with invalid characters", () => {
    expect(Email.isValid("email@domínio.com")).toBe(false);
  });

  test("should return true for valid email", () => {
    expect(Email.isValid("email@domain.com")).toBe(true);
  });
});
