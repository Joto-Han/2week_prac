'use strict';
const {
    Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.User.hasMany(models.Post, { foreignKey: 'userId' });
            models.User.hasMany(models.Comment, { foreignKey: 'userId' });
            models.User.hasMany(models.Like, { foreignKey: 'userId' });
        }
    }
    User.init({
        userId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        nickname: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};