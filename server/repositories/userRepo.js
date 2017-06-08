'use strict';

let UserModel = require('../models/UserModel');

exports.getUsers = (filters) => UserModel.find(filters).exec();

exports.createUser = (user) => UserModel.create(user);

/**
 * DI - don't use in real code
 */
exports._getUserModel = () => UserModel;
exports._setUserModel = newUserModel => UserModel = newUserModel;