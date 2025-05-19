import * as chrono from 'chrono-node';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Mapeamento de meses abreviados em pt-BR para inglês.
 */
const monthMap: Record<string, string> = {
  jan: 'january',
  fev: 'february',
  mar: 'march',
  abr: 'april',
  mai: 'may',
  jun: 'june',
  jul: 'july',
  ago: 'august',
  set: 'september',
  out: 'october',
  nov: 'november',
  dez: 'december'
};

/**
 * Substitui os meses abreviados em pt-BR por seus equivalentes em inglês.
 */
function normalizeMonthToEnglish(input: string): string {
  return input.replace(
    /\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\b/gi,
    (match) => monthMap[match.toLowerCase()]
  );
}

/**
 * Formata uma data para o formato pt-BR.
 *
 * @param date - A data a ser formatada.
 * @param options - Configurações de formatação.
 * @returns String da data formatada ou mensagem de erro/undefined.
 */
export function formatDateToPtBR(
  date?: Date | string | null,
  options: {
    includeTime?: boolean;
    formatStyle?: 'extended' | 'short';
  } = {}
): string | undefined {
  if (!date) return undefined;

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) return 'formato incorreto';

  const { includeTime = true, formatStyle = 'extended' } = options;

  const timePart = includeTime ? ', HH:mm' : '';
  const formatStr =
    formatStyle === 'extended'
      ? `dd 'de' MMM 'de' yyyy${timePart}`
      : `dd/MM/yyyy${includeTime ? ' HH:mm' : ''}`;

  return format(parsedDate, formatStr, { locale: ptBR });
}

/**
 * Converte uma string de data pt-BR com meses abreviados para objeto Date.
 *
 * @param input - A string com a data.
 * @returns Objeto Date ou null.
 */
export function parsePtBRDateString(input: string): Date | null {
  const normalized = normalizeMonthToEnglish(input);
  return chrono.parseDate(normalized);
}

/**
 * Regex para validar datas como "25 de jan 2025, 14:30".
 */
const dateBrRegex =
  /^(\d{1,2})\s(de\s)?(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s(de\s)?\d{4},?\s?([0-1]?\d|2[0-3]):[0-5]\d?$/i;

/**
 * Valida se a string segue o formato pt-BR esperado.
 */
export function isValidPtBRDateFormat(dateStr: string): boolean {
  return dateBrRegex.test(dateStr.trim());
}
