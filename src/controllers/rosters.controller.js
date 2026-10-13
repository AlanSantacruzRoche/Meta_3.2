import { Jugador, Roster, RosterJugador } from '../models/index.js';
import { validarCampos } from '../utils/errors.js';
import { validarAsignacion, listarRosters } from '../services/rosters.service.js';

export async function listar(req, res, next) {
  try {
    const { tipo, temporada } = req.query;
    if (tipo && !['Principal', 'Academy'].includes(tipo)) return res.status(400).json({ error: 'Tipo inválido. Usa Principal o Academy.' });
    res.json(await listarRosters({ tipo, temporada }));
  } catch (e) { next(e); }
}

export async function detalle(req, res, next) {
  try {
    const roster = await Roster.findByPk(req.params.id, {
      include: [{ model: Jugador, as: 'jugadores', attributes: ['id', 'nickname', 'rol', 'pais', 'estado'], through: { attributes: ['rol_en_roster'] } }]
    });
    if (!roster) return res.status(404).json({ error: 'Roster no encontrado.' });
    const data = roster.toJSON();
    data.jugadores = data.jugadores.map(j => ({
      id: j.id, nickname: j.nickname, rol: j.rol, pais: j.pais, estado: j.estado,
      rol_en_roster: j.RosterJugador.rol_en_roster
    }));
    res.json(data);
  } catch (e) { next(e); }
}

export async function crear(req, res, next) {
  try {
    const faltantes = validarCampos(req.body, ['nombre', 'temporada']);
    if (faltantes.length) return res.status(400).json({ error: 'Faltan campos obligatorios.', campos: faltantes });
    if (req.body.tipo && !['Principal', 'Academy'].includes(req.body.tipo)) return res.status(400).json({ error: 'Tipo inválido. Usa Principal o Academy.' });
    const roster = await Roster.create({
      nombre: String(req.body.nombre).trim(),
      juego: req.body.juego || 'League of Legends',
      tipo: req.body.tipo || 'Principal',
      temporada: String(req.body.temporada)
    });
    res.status(201).json(roster);
  } catch (e) { next(e); }
}

export async function actualizar(req, res, next) {
  try {
    const roster = await Roster.findByPk(req.params.id);
    if (!roster) return res.status(404).json({ error: 'Roster no encontrado.' });
    const { nombre, juego, tipo, temporada } = req.body;
    if (tipo !== undefined && !['Principal', 'Academy'].includes(tipo)) return res.status(400).json({ error: 'Tipo inválido. Usa Principal o Academy.' });
    if (nombre !== undefined && !String(nombre).trim()) return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    await roster.update({
      ...(nombre !== undefined && { nombre: String(nombre).trim() }),
      ...(juego !== undefined && { juego }),
      ...(tipo !== undefined && { tipo }),
      ...(temporada !== undefined && { temporada: String(temporada) })
    });
    res.json(roster);
  } catch (e) { next(e); }
}

export async function eliminar(req, res, next) {
  try {
    const roster = await Roster.findByPk(req.params.id);
    if (!roster) return res.status(404).json({ error: 'Roster no encontrado.' });
    await RosterJugador.destroy({ where: { id_roster: roster.id } });
    await roster.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
}

export async function listarJugadores(req, res, next) {
  try {
    const roster = await Roster.findByPk(req.params.id);
    if (!roster) return res.status(404).json({ error: 'Roster no encontrado.' });
    const asignaciones = await RosterJugador.findAll({
      where: { id_roster: roster.id }, include: [{ model: Jugador, attributes: ['id', 'nickname', 'nombre_real', 'pais', 'rol', 'estado'] }]
    });
    res.json(asignaciones.map(a => ({ ...a.Jugador.toJSON(), rol_en_roster: a.rol_en_roster })));
  } catch (e) { next(e); }
}

export async function asignarJugador(req, res, next) {
  try {
    const faltantes = validarCampos(req.body, ['id_jugador', 'rol_en_roster']);
    if (faltantes.length) return res.status(400).json({ error: 'Faltan campos obligatorios.', campos: faltantes });
    const error = await validarAsignacion(req.params.id, req.body.id_jugador, req.body.rol_en_roster);
    if (error) return res.status(error.status).json({ error: error.error });
    const asignacion = await RosterJugador.create({
      id_roster: req.params.id, id_jugador: req.body.id_jugador, rol_en_roster: req.body.rol_en_roster
    });
    res.status(201).json(asignacion);
  } catch (e) { next(e); }
}

export async function cambiarRolJugador(req, res, next) {
  try {
    const asignacion = await RosterJugador.findOne({ where: { id_roster: req.params.id, id_jugador: req.params.id_jugador } });
    if (!asignacion) return res.status(404).json({ error: 'La asignación no existe en este roster.' });
    const error = await validarAsignacion(req.params.id, req.params.id_jugador, req.body.rol_en_roster, asignacion.id);
    if (error) return res.status(error.status).json({ error: error.error });
    await asignacion.update({ rol_en_roster: req.body.rol_en_roster });
    res.json(asignacion);
  } catch (e) { next(e); }
}

export async function quitarJugador(req, res, next) {
  try {
    const asignacion = await RosterJugador.findOne({ where: { id_roster: req.params.id, id_jugador: req.params.id_jugador } });
    if (!asignacion) return res.status(404).json({ error: 'La asignación no existe en este roster.' });
    await asignacion.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
}
