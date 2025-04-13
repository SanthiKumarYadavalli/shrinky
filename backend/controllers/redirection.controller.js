import { getClientInfo } from "../utils.js";
import UrlService from "../services/url.service.js";
import ClickService from "../services/click.service.js";
import { broadcast } from "../utils/websocket.js";

export default class RedirectionController {
  constructor() {
    this.urlService = new UrlService();
    this.clickService = new ClickService(); 
  }
  
  redirect = async (req, res) => {
    try {
      const { shortCode } = req.params;
      const url = await this.urlService.getUrlByShortCode(shortCode);
      await this.clickService.createClick(url._id, getClientInfo(req));
      await this.urlService.incrementClickCount(url._id);
      broadcast(url.userId, {type: "clicks_increment", urlId: url._id});
      res.redirect(url.originalURL);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
}
