import ClickRepository from '../repositories/click.repository.js';

export default class ClickService {
  constructor() {
    this.clickRepository = new ClickRepository();
  }

  createClick = async (urlId, data) => {
    try {
      return this.clickRepository.create({ ...data, urlId });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getClickData = async (urlId) => {
    try {
      const clicks = await this.clickRepository.findAll({ filters: { urlId } });
      return clicks;
    } catch (error) {
      throw new Error(error.message);
    }
  }
} 
