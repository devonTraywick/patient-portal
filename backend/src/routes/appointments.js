const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Appointment, Patient } = require('../models');
const authMiddleware = require('../middleware/auth'); //must set req.uer

// GET /api/appointments - Get all appointments for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const patient = await Patient.findOne({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const appointments = await Appointment.findAll(
            { 
                where: { patientId: patient.id },
                order: [['appointmentDate', 'ASC']] 
            });
        res.json(appointments);
    } catch (err) {
        console.error('Get appointments error: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/appointments - Create a new appointment for the authenticated user
router.post('/', auth, async (req, res) => {
    try {
        const patient = await Patient.findOne({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const { providerName, dateTime, reason } = req.body;
        if (!dateTime) {
            return res.status(400).json({ message: 'Appointment date and reason are required' });
        }

        const newAppointment = await Appointment.create({
            patientId: patient.id,
            providerName,
            appointmentDate: new Date(dateTime),
            reason
        });
        res.status(201).json(newAppointment);
    } catch (err) {
        console.error('Create appointment error: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', authMiddleware, async(req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user?.id;

    if(!appointmentId) return res.status(400).json({message: 'Appointment id required'});

    try {
        // 1) Load appointment with its patient to verify ownership
        const appointment = await Appointment.findByPk(appointmentId, {
        include: { model: Patient, attributes: ['id', 'userId'] }
        });

        // 2) Not found -> 404
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // 3) Authorization: ensure the appointment belongs to a patient owned by the user
        if (!appointment.Patient || appointment.Patient.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: cannot delete this appointment' });
        }

        // 4) Delete the appointment
        await appointment.destroy();

        // 5) Return success
        return res.json({ message: 'Appointment deleted', id: appointmentId });
    } catch (error) {
        console.error('Delete appointment error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;