const SessionService = require("../services/session-service");
const UserService = require("../services/user-service");
const Email = require("../utils/email-validator");

class SessionController {
  static async create(req, res) {
    try {
      const { email, password } = req.body;

      if (!Email.isValid(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      const user = await UserService.userExistsAndCheckPassword({
        email,
        password,
      });

      if (user === null) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (user === false) {
        return res.status(400).json({ error: "Senha inválida" });
      }

      const token = await SessionService.generateToken({ email });

      console.log("Token: ", token);
      return res.status(200).json({ token });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "Server Error");
    }
  }
}

module.exports = SessionController;
