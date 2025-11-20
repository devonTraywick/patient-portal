const {DataTypes} = require('sequelize');
const {v4: uuidv4} = require('uuid');

module.exports = (sequelize) => {
    return sequelize.define('Patient', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
        }
    },
    {
        tableName: 'patients'
    });
}