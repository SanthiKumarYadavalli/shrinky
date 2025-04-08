import UrlRepository from '../repositories/url.repository.js';
import { nanoid } from 'nanoid';

export default class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  async createUrl(data) {
    try {
      const { originalURL, customAlias, expiresAt, userId } = data;
      if (!originalURL) {
        throw new Error("Original URL is required");
      }

      const shortCode = nanoid(6);

      // check if customAlias is already taken
      if (customAlias) {
        const existingUrl = await this.urlRepository.findOne({ customAlias });
        if (existingUrl) {
          throw new Error("Custom alias already taken");
        }
      }
      const url = await this.urlRepository.create({
        originalURL,
        shortCode,
        customAlias,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId,
      });
      return url;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllUrls(userId) {  
    try {
      const urls = await this.urlRepository.findAll({filters: {userId}});
      return urls;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUrlByShortCode(shortCode) {
    try {
      // return original url by random shortcode or alias
      const url = await this.urlRepository.findOne({$or: [{shortCode}, {customAlias: shortCode}]});
      if (!url) {
        throw new Error("URL not found");
      }
      if (url.expiresAt && url.expiresAt < new Date()) {
        throw new Error("URL expired");
        }
        return url;
    } catch (error) {
      throw new Error(error.message);
    }
  } 

  async getUrlById(id) {
    try {
      const url = await this.urlRepository.findById(id);
      return url;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUrl(id, data) {
    try {
      const url = await this.urlRepository.findByIdAndUpdate(id, data);
      return url;
    } catch (error) {
      throw new Error(error.message);
    }
  } 

  async incrementClickCount(id) {
    try {
      const url = await this.urlRepository.findByIdAndUpdate(id, { $inc: { totalClicks: 1 } });
      return url;
    } catch (error) {
      throw new Error(error.message);
    }
  } 

  async deleteUrl(id) {
    try {
      const url = await this.urlRepository.findByIdAndDelete(id);
      return url;
    } catch (error) {
      throw new Error(error.message);
    }
  } 
}
