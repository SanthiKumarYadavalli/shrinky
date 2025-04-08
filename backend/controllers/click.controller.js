import ClickService from "../services/click.service.js";

export default class ClickController {
  constructor() {
    this.clickService = new ClickService();
  }

  getClickData = async (req, res) => {
    try {
      const { urlId } = req.params;
      const clicks = await this.clickService.getClickData(urlId);
      return res.status(200).json(clicks);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
} 
