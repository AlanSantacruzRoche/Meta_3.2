import { Jugador } from '../models/index.js';
import * as service from '../services/jugadores.service.js';
import { roles, estados } from '../models/jugador.model.js';
import { validarCampos } from '../utils/errors.js';

export async function listar(req, res, next) {
  try {
    const { rol, estado, search } = req.query;
    if (rol && !roles.includes(rol)) return res.status(400).json({ error: 'Rol inválido.', roles });
    if (estado && !estados.includes(estado)) return res.status(400).json({ error: 'Estado inválido.', estados });
    const jugadores = await service.listarJugadores({ rol, estado, search });
    res.json(jugadores);
  } catch (e) { next(e); }
}

export async function detalle(req, res, next) {
  try {
    const jugador = await service.obtenerJugador(req.params.id);
    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado.' });
    res.json(jugador);
  } catch (e) { next(e); }
}

export async function crear(req, res, next) {
  try {
    const faltantes = validarCampos(req.body, ['nickname', 'rol']);
    if (faltantes.length) return res.status(400).json({ error: 'Faltan campos obligatorios.', campos: faltantes });
    if (!roles.includes(req.body.rol)) return res.status(400).json({ error: 'Rol inválido.', roles });
    if (req.body.estado && !estados.includes(req.body.estado)) return res.status(400).json({ error: 'Estado inválido.', estados });
    const jugador = await service.crearJugador(req.body);
    res.status(201).json(jugador);
  } catch (e) { next(e); }
}

export async function actualizar(req, res, next) {
  try {
    const jugador = await service.obtenerJugador(req.params.id);
    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado.' });
    const { nickname, nombre_real, pais, rol, estado } = req.body;
    if (rol !== undefined && !roles.includes(rol)) return res.status(400).json({ error: 'Rol inválido.', roles });
    if (estado !== undefined && !estados.includes(estado)) return res.status(400).json({ error: 'Estado inválido.', estados });
    if (nickname !== undefined && !String(nickname).trim()) return res.status(400).json({ error: 'El nickname no puede estar vacío.' });
    await service.actualizarJugador(jugador, req.body);
    res.json(jugador);
  } catch (e) { next(e); }
}

export async function eliminar(req, res, next) {
  try {
    const jugador = await service.obtenerJugador(req.params.id);
    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado.' });
    await service.eliminarJugador(jugador);
    res.status(204).end();
  } catch (e) { next(e); }
}
