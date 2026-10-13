import { Op } from 'sequelize';
import { Jugador, Roster, RosterJugador } from '../models/index.js';

export async function validarAsignacion(idRoster, idJugador, rolEnRoster, excluirId = null) {
  if (!['Titular', 'Suplente'].includes(rolEnRoster)) return { status: 400, error: 'rol_en_roster debe ser Titular o Suplente.' };
  const roster = await Roster.findByPk(idRoster);
  if (!roster) return { status: 404, error: 'Roster no encontrado.' };
  const jugador = await Jugador.findByPk(idJugador);
  if (!jugador) return { status: 404, error: 'Jugador no encontrado.' };
  if (rolEnRoster === 'Titular') {
    const where = { id_roster: idRoster, rol_en_roster: 'Titular' };
    if (excluirId) where.id = { [Op.ne]: excluirId };
    const titulares = await RosterJugador.findAll({ where, include: [{ model: Jugador, attributes: ['rol'] }] });
    if (titulares.length >= 5) return { status: 409, error: 'Un roster no puede tener más de 5 titulares.' };
    if (titulares.some(a => a.Jugador.rol === jugador.rol)) return { status: 409, error: `Ya existe un titular con el rol ${jugador.rol} en este roster.` };
  }
  return null;
}

export async function listarRosters({ tipo, temporada }) {
  const where = {}; if (tipo) where.tipo = tipo; if (temporada) where.temporada = String(temporada);
  const rosters = await Roster.findAll({ where, order: [['nombre', 'ASC']], include: [{ model: Jugador, as: 'jugadores', attributes: ['id'], through: { attributes: [] }, required: false }] });
  return rosters.map(r => { const data = r.toJSON(); data.cantidad_jugadores = data.jugadores.length; delete data.jugadores; return data; });
}
