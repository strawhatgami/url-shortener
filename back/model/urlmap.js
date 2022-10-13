import sequelizeImport from 'sequelize';
const { DataTypes } = sequelizeImport;
import sequelize from "./connection.js";

//const instanceMethods = {
//  generateHash(password) {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//  },
//  verifyPassword(pw) {
//    return bcrypt.compareSync(pw, this.password);
//  },
//}
//

const classMethods = {
  async fromFullUrl(full) {
    const nbUrls = await Model.count();
    const shortened = "" + nbUrls;
    const urlMap = await Model.create({full, shortened});
    return urlMap;
  },
}

const Model = sequelize.define("URLMap", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  shortened: {
    unique: true,
    type: DataTypes.STRING,
  },
  full: {
    type: DataTypes.STRING,
  },
}, {}, {
  timestamps: false,
  sequelize,
});

//const getDescriptors = (methods) => {
//  return Object.keys(methods).reduce((descriptors, key) => {
//    descriptors[key] = Object.getOwnPropertyDescriptor(methods, key);
//    return descriptors;
//  }, {});
//}
//
//const augmentPrototype = (classObj, methods) => {
//  Object.defineProperties(classObj.prototype, getDescriptors(methods));
//}
//
//augmentPrototype(Model, instanceMethods);

Object.assign(Model, classMethods);

//sequelize.sync({force: true});

export default Model;
