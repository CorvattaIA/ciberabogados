// src/logic/testAnalyzer.js

/**
 * Analyzes the user's answers to the diagnostic test.
 * @param {object} answers - Object containing user's responses, keyed by question ID.
 *                           e.g., { laboral_q1: { value: 'si', detail: '...' }, ... }
 * @param {object} questionsData - The full questions JSON structure from diagnosticQuestions.json.
 * @returns {object} An object containing analysis results:
 *                   { primaryArea: string | null,
 *                     riskLevel: 'alto' | 'medio' | 'bajo' | 'informativo',
 *                     recommendations: Array<string> }
 */
export const analyzeAnswers = (answers, questionsData) => {
  if (!answers || !questionsData || !questionsData.areas) {
    return {
      primaryArea: null,
      riskLevel: 'informativo',
      recommendations: ['No se pudieron analizar las respuestas.'],
    };
  }

  let areaScores = {};
  let recommendations = [];
  let totalYesOrConcerningAnswers = 0;

  questionsData.areas.forEach(area => {
    areaScores[area.id] = { score: 0, name: area.nombre, criticalIssues: 0 };
    area.preguntas.forEach(question => {
      const answerObj = answers[question.id];
      if (answerObj) {
        const answerValue = typeof answerObj === 'object' ? answerObj.value : answerObj; // Handle simple value or {value, detail}
        // Simple scoring: 'si' often indicates an issue or relevance.
        // 'multiple_choice' needs specific logic per question if one option is more "concerning".
        if (answerValue === 'si') {
          areaScores[area.id].score += 1;
          totalYesOrConcerningAnswers += 1;
          // Example of a pattern-based recommendation within an area
          if (area.id === 'laboral' && question.id === 'laboral_q1' && answerObj.detail) {
            recommendations.push(
              `Laboral: Se ha detectado un problema con empleador/empleados. Considere revisar la documentación y buscar asesoría específica sobre: "${answerObj.detail}".`
            );
            areaScores[area.id].criticalIssues += 1;
          }
        } else if (answerValue === 'no' && question.id === 'laboral_q2') { // Example: 'no' is concerning for this question
            areaScores[area.id].score += 1;
            totalYesOrConcerningAnswers += 1;
            recommendations.push(
                `Laboral: No contar con Reglamento Interno de Trabajo actualizado puede generar riesgos. Se recomienda su elaboración/actualización.`
            );
            areaScores[area.id].criticalIssues += 1;
        } else if (question.tipo_respuesta === 'multiple_choice' && answerValue === 'prestacion_servicios' && question.id === 'laboral_q3') {
            areaScores[area.id].score += 0.5; // Slightly less weight, but notable
             recommendations.push(
                `Laboral: El uso de contratos de prestación de servicios debe evaluarse cuidadosamente para evitar la configuración de una relación laboral encubierta.`
            );
        }
        // Add more specific rules for other questions and areas here
        if (area.id === 'comercial' && question.id === 'comercial_q1' && answerValue === 'si') {
            areaScores[area.id].criticalIssues +=1;
            recommendations.push(
                `Comercial: Conflictos en contratos comerciales importantes requieren atención legal para mitigar riesgos y buscar soluciones.`
            );
        }
        if (area.id === 'tributario' && question.id === 'tributario_q1' && answerValue === 'si') {
             areaScores[area.id].criticalIssues +=1;
            recommendations.push(
                `Tributario: Consultas o notificaciones tributarias deben ser atendidas prontamente para evitar sanciones. Es recomendable asesoría fiscal.`
            );
        }
      }
    });
  });

  let primaryArea = null;
  let highestScore = -1;
  let highestCritical = -1;

  for (const areaId in areaScores) {
    // Prioritize area with most critical issues, then by general score
    if (areaScores[areaId].criticalIssues > highestCritical) {
      highestCritical = areaScores[areaId].criticalIssues;
      primaryArea = areaScores[areaId].name;
      highestScore = areaScores[areaId].score; // Update highest score too
    } else if (areaScores[areaId].criticalIssues === highestCritical && areaScores[areaId].score > highestScore) {
      primaryArea = areaScores[areaId].name;
      highestScore = areaScores[areaId].score;
    }
  }
  
  // If no critical issues, pick area with highest general score.
  if (highestCritical === 0) {
      for (const areaId in areaScores) {
          if (areaScores[areaId].score > highestScore) {
              highestScore = areaScores[areaId].score;
              primaryArea = areaScores[areaId].name;
          }
      }
  }


  let riskLevel = 'informativo'; // Default if no specific issues
  if (highestCritical > 1 || highestScore > 3) { // Example thresholds
    riskLevel = 'alto';
  } else if (highestCritical === 1 || highestScore > 1) {
    riskLevel = 'medio';
  } else if (highestScore === 1 || totalYesOrConcerningAnswers > 0) { // if any area got a point or any concerning answer
    riskLevel = 'bajo';
  }


  if (recommendations.length === 0 && totalYesOrConcerningAnswers === 0) {
    recommendations.push('Basado en sus respuestas, no se identifican áreas de preocupación inmediata. Este test es informativo.');
  } else if (recommendations.length === 0) {
    recommendations.push(`Aunque se marcaron algunas respuestas, no hay recomendaciones específicas predefinidas para su caso. Considere discutir sus respuestas con un asesor si tiene inquietudes en el área de ${primaryArea || 'interés'}.`);
  }


  return {
    primaryArea: primaryArea || 'General', // Default if no area stands out
    riskLevel,
    recommendations,
    detailedScores: areaScores // For potential display or debugging
  };
};

export default {
  analyzeAnswers,
};
