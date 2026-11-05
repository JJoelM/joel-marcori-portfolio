/**
 * Utilidad de ordenamiento cronológico para proyectos y expedientes.
 * Ordena de más reciente a más antiguo, teniendo en cuenta años, meses y proyectos en curso (Actualidad / Present).
 */
export function parseFechaReciente(fechaStr) {
  if (!fechaStr) return 0;
  const str = String(fechaStr).toLowerCase().trim();

  const esActual = str.includes("actualidad") || str.includes("present");
  const anos = str.match(/\b(20\d{2})\b/g);

  // Año más reciente mencionado
  let maxAno = anos ? Math.max(...anos.map(Number)) : 2020;
  if (esActual) {
    maxAno = Math.max(maxAno, 2026);
  }

  const meses = {
    enero: 1, january: 1,
    febrero: 2, february: 2,
    marzo: 3, march: 3,
    abril: 4, april: 4,
    mayo: 5, may: 5,
    junio: 6, june: 6,
    julio: 7, july: 7,
    agosto: 8, august: 8,
    septiembre: 9, september: 9,
    octubre: 10, october: 10,
    noviembre: 11, november: 11,
    diciembre: 12, december: 12,
  };

  // Analizar la parte final del rango si existe ("Marzo 2026 - Abril 2026")
  const partes = str.split(/[-–—]/);
  const parteFinal = partes.length > 1 ? partes[partes.length - 1] : partes[0];

  let mesFinal = 0;
  for (const [mes, num] of Object.entries(meses)) {
    if (parteFinal.includes(mes)) {
      mesFinal = Math.max(mesFinal, num);
    }
  }

  // Si no se encontró mes en la parte final pero sí en la inicial
  if (mesFinal === 0) {
    for (const [mes, num] of Object.entries(meses)) {
      if (str.includes(mes)) {
        mesFinal = Math.max(mesFinal, num);
      }
    }
  }

  // Si tiene rango de inicio y fin, el año de inicio sirve como desempate fino
  const anoInicio = anos && anos.length > 0 ? Number(anos[0]) : maxAno;

  // Cálculo de score numérico: Año * 10000 + Mes * 100 + Desempate de año de inicio
  return maxAno * 100000 + mesFinal * 1000 + (esActual ? 500 : 0) + (anoInicio % 100);
}

/**
 * Ordena una lista de proyectos de más reciente a más antiguo.
 */
export function ordenarProyectosRecientes(proyectos = []) {
  return [...proyectos].sort((a, b) => {
    return parseFechaReciente(b.fecha) - parseFechaReciente(a.fecha);
  });
}
