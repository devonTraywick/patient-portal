const {DataTypes} = require('sequelize');
const {v4: uuidv4} = require('uuid');

module.exports = (sequelize) => {
    return sequelize.define('Provider', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            default: () => uuidv4(),
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: () => 'true'
        }
    }, {
        tableName: 'providers',
        timestamps: false,
    })
}