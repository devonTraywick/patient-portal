const sequelize = require('../config/db');
const createUser = require('./user');
const createPatient = require('./patient');
const createAppointment = require('./appointment');
const createProvider = require('./provider');

const User = createUser(sequelize);
const Patient = createPatient(sequelize);
const Appointment = createAppointment(sequelize);
const Provider = createProvider(sequelize);

//Define associations
User.hasOne(Patient, {foreignKey: 'userId', onDelete:"CASCADE"});
Patient.belongsTo(User, {foreignKey: 'userId'});

Patient.hasMany(Appointment, {foreignKey: 'patientId', onDelete:"CASCADE"});
Appointment.belongsTo(Patient, {foreignKey: 'patientId'});

module.exports = {
    sequelize,
    User,
    Patient,
    Appointment,
    Provider,
};