const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { getEvents, createEvent, upadteEvent, deleteEvent } = require('../controllers/events');
const isDate = require('../helpers/isDate');
const { validateFields } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');


// Validar JWT en todas las acciones
router.use( validateJWT );

// Obtener eventos
router.get('/', getEvents);

// Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de final es obligatoria').custom( isDate ),
        validateFields
    ], 
    createEvent
);

// Actualizar evento
router.put('/:id', upadteEvent);

// Borrar evento
router.delete('/:id', deleteEvent);


module.exports = router;