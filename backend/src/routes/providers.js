const express = require('express');
const router = express.Router();
const { Provider } = require('../models')
const { Op, fn, col, where } = require('sequelize')

router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';

        const providers = await Provider.findAll({
            where: where(
                fn('UPPER', col('name')),
                {
                [Op.like]: `%${search.toUpperCase()}%`
                },
            ),
            order: [['name', 'ASC']],
            limit: 10
        });

        res.json(providers)
    } catch (error) {
        console.error('Provider search error: ', error);
        res.status(500).json({message: `Internal server error: ${error}`});
    }
});

module.exports = router;