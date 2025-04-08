import Url from '../models/url.model.js';
import CrudRepository from './crud.repository.js';

export default class UrlRepository extends CrudRepository {
  constructor() {
    super(Url);
  }
}