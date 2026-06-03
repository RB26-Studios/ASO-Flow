/**
 * Cálculo de Validade do ASO conforme NR-7.
 * 
 * Regras (RF-025):
 * - Risco 1 ou 2:
 *   - Se o funcionário tiver menos de 45 anos: validade de 2 anos (730 dias)
 *   - Se o funcionário tiver 45 anos ou mais: validade de 1 ano (365 dias)
 * - Risco 3 ou 4:
 *   - Validade de 1 ano (365 dias) independente da idade
 * - Exame Admissional/Demissional:
 *   - Não tem validade (válido apenas para aquela ação)
 */

import { addYears, differenceInYears, parseISO, format } from 'date-fns'

export type ExamType = 'ADMISSIONAL' | 'PERIODICO' | 'DEMISSIONAL' | 'RETORNO' | 'MUDANCA'

interface AsoValidityParams {
  /** Data de nascimento do funcionário (formato ISO: YYYY-MM-DD) */
  birthDate: string
  /** Grau de risco do cliente (1 a 4) */
  riskDegree: number
  /** Data do exame/atendimento (formato ISO: YYYY-MM-DD) */
  examDate: string
  /** Tipo do exame */
  examType: ExamType
}

interface AsoValidityResult {
  /** Data de validade calculada (formato ISO: YYYY-MM-DD) ou null se não aplicável */
  validityDate: string | null
  /** Quantidade de anos de validade */
  validityYears: number | null
  /** Motivo explicativo */
  reason: string
}

/**
 * Calcula a data de validade do ASO com base nas regras da NR-7.
 */
export function calculateAsoValidity({
  birthDate,
  riskDegree,
  examDate,
  examType,
}: AsoValidityParams): AsoValidityResult {

  // Exames admissionais e demissionais não têm validade periódica
  if (examType === 'ADMISSIONAL' || examType === 'DEMISSIONAL') {
    return {
      validityDate: null,
      validityYears: null,
      reason: `Exame ${examType.toLowerCase()} — validade não se aplica.`
    }
  }

  const examDateParsed = parseISO(examDate)
  const birthDateParsed = parseISO(birthDate)

  // Calcula a idade do funcionário na data do exame
  const age = differenceInYears(examDateParsed, birthDateParsed)

  let validityYears: number

  if (riskDegree >= 3) {
    // Risco 3 ou 4: sempre 1 ano
    validityYears = 1
  } else {
    // Risco 1 ou 2: depende da idade
    validityYears = age >= 45 ? 1 : 2
  }

  const validityDate = addYears(examDateParsed, validityYears)

  return {
    validityDate: format(validityDate, 'yyyy-MM-dd'),
    validityYears,
    reason: `Risco ${riskDegree}, ${age} anos → validade de ${validityYears} ano(s).`
  }
}
