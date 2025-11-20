const {DataTypes} = require('sequelize');
const {v4: uuidv4} = require('uuid');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullName:{
            type: DataTypes.STRING,
        },
        role:{
            type: DataTypes.STRING,
            defaultValue: 'patient',
        }
    }, {
        tableName: 'users'
    });
};