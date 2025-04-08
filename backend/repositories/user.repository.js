import CrudRepository from "./crud.repository.js";
import User from "../models/user.model.js";

export default class UserRepository extends CrudRepository {
  constructor () {
    super(User);
  }
}
