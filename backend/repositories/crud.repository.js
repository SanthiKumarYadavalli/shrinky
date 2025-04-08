
export default class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  create = async (data) => {
    try {
      const doc = await this.model.create(data);
      return doc;
    } catch (error) {
      throw Error(`Error while creating document: ${error.message}`);
    }
  }

  findOne = async (query) => {
    try {
      const doc = await this.model.findOne(query);
      return doc;
    } catch (error) {
      throw Error(`Error while finding document: ${error.message}`);
    }
  }

  findById = async (id, populateFields=[]) => {
    try {
      const doc = await this.model.findById(id).populate(...populateFields);
      return doc;
    } catch (error) {
      throw Error(`Error while finding document: ${error.message}`);
    }
  }

  findAll = async ({
    filters = {},
    paginationOptions = {},
    populateOptions = null,
    sortOptions = { createdAt: -1 },
    projectionFields = ""
  } = {}) => {
    try {
      let { page, pageSize } = paginationOptions;
      let skip = 0;
      if (page && pageSize) {
        page = parseInt(page);
        pageSize = parseInt(pageSize);
        skip = pageSize * (page - 1);
      }
      return await this.model
        .find(filters, projectionFields)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .populate(populateOptions);
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }


  findByIdAndUpdate = async (id, data) => {
    try {
      const doc = await this.model.findByIdAndUpdate(id, data, { new: true });
      return doc;
    } catch (error) {
      throw Error(`Error while updating document: ${error.message}`);
    }
  }

  findByIdAndDelete = async (id) => {
    try {
      const doc = await this.model.findByIdAndDelete(id);
      return doc;
    } catch (error) {
      throw Error(`Error while deleting document: ${error.message}`);
    }
  }

  deleteOne = async (query) => {
    try {
      const doc = await this.model.deleteOne(query);
      return doc;
    } catch (error) {
      throw Error(`Error while deleting document: ${error.message}`);
    }
  }
}