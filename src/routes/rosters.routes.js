import { Router } from 'express';
import * as c from '../controllers/rosters.controller.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();
router.get('/', c.listar);
router.get('/:id/jugadores', c.listarJugadores);
router.post('/:id/jugadores', requireAdmin, c.asignarJugador);
router.put('/:id/jugadores/:id_jugador', requireAdmin, c.cambiarRolJugador);
router.delete('/:id/jugadores/:id_jugador', requireAdmin, c.quitarJugador);
router.get('/:id', c.detalle);
router.post('/', requireAdmin, c.crear);
router.put('/:id', requireAdmin, c.actualizar);
router.delete('/:id', requireAdmin, c.eliminar);
export default router;
