import UserService from "../services/user.service.js";

export default class UserController {
  constructor () {
    this.service = new UserService();
  }  

  register = async (req, res) => {
    try {
      const user = await this.service.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  login = async (req, res) => {
    try {
      const token = await this.service.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
