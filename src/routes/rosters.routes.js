import { Router } from 'express';
import * as c from '../controllers/rosters.controller.js';
import { requireAdmin } from '../middleware/admin.js';
import { validateIdParams } from '../middleware/validateId.js';

const router = Router();
router.get('/', c.listar);
router.get('/:id/jugadores', validateIdParams('id'), c.listarJugadores);
router.post('/:id/jugadores', requireAdmin, validateIdParams('id'), c.asignarJugador);
router.put('/:id/jugadores/:id_jugador', requireAdmin, validateIdParams('id', 'id_jugador'), c.cambiarRolJugador);
router.delete('/:id/jugadores/:id_jugador', requireAdmin, validateIdParams('id', 'id_jugador'), c.quitarJugador);
router.get('/:id', validateIdParams('id'), c.detalle);
router.post('/', requireAdmin, c.crear);
router.put('/:id', requireAdmin, validateIdParams('id'), c.actualizar);
router.delete('/:id', requireAdmin, validateIdParams('id'), c.eliminar);
export default router;
