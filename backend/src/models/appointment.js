const {DataTypes} = require('sequelize');
const {v4: uuidv4} = require('uuid');

module.exports = (sequelize) => {
    return sequelize.define('Appointment', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        patientId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        providerName: {
            type: DataTypes.STRING,
        },
        appointmentDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'scheduled',
        }
    },
    {
        tableName: 'appointments'
    });
}