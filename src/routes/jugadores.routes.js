import { Router } from 'express';
import * as c from '../controllers/jugadores.controller.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();
router.get('/', c.listar);
router.get('/:id', c.detalle);
router.post('/', requireAdmin, c.crear);
router.put('/:id', requireAdmin, c.actualizar);
router.delete('/:id', requireAdmin, c.eliminar);
export default router;
