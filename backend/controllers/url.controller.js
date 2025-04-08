import UrlService from "../services/url.service.js";

export default class UrlController {
  constructor() {
    this.urlService = new UrlService();
  }

  createShortUrl = async (req, res) => {
    try {
      const { originalURL, customAlias, expiresAt } = req.body;
      const userId = req.user.id;
      const url = await this.urlService.createUrl({
        originalURL,
        customAlias,
        expiresAt,
        userId,
      });
      res.status(201).json(url);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllUrls = async (req, res) => {
    try {
      const userId = req.user.id;
      const urls = await this.urlService.getAllUrls(userId);
      res.status(200).json(urls);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getUrlById = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const url = await this.urlService.getUrlById(id, userId);
      res.status(200).json(url);  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateUrl = async (req, res) => {
    try {
      const { id } = req.params;
      const url = await this.urlService.updateUrl(id, req.body);
      res.status(200).json(url);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteUrl = async (req, res) => {
    try { 
      const { id } = req.params;
      const userId = req.user.id;
      await this.urlService.deleteUrl(id, userId);
      res.status(204).json({ message: "URL deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
