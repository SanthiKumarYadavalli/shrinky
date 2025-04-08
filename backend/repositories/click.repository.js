import Click from '../models/click.model.js';
import CrudRepository from './crud.repository.js';

export default class ClickRepository extends CrudRepository {
  constructor() {
    super(Click);
  }
}
