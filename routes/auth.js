/* 
    Rutas de Usuarios / Auth:
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, userLogin, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post(
    '/new',
    [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'La contraseña no es segura').isLength({ min: 6 }),
        validateFields
    ], 
    createUser
);

router.post(
    '/', 
    [
        check('email', 'El email no es valido').isEmail(),
        check('password', 'La contraseña no es segura').isLength({ min: 6 }),
        validateFields
    ],
    userLogin
);

router.get('/renew', validateJWT, renewToken);


module.exports = router;
