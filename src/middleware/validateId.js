export function validateIdParams(...names) {
  return (req, res, next) => {
    for (const name of names) {
      const raw = req.params[name];
      if (!/^[1-9]\d*$/.test(String(raw))) return res.status(400).json({ error: `ID inválido: ${name} debe ser un entero positivo.` });
      const value = Number(raw);
      if (!Number.isSafeInteger(value)) return res.status(400).json({ error: `ID inválido: ${name} está fuera de rango.` });
      req.params[name] = String(value);
    }
    next();
  };
}
