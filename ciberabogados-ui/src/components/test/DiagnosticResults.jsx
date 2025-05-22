import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';

const DiagnosticResults = ({ analysisResults, sessionId }) => {
  if (!analysisResults) {
    return (
      <Card className="text-center p-10 max-w-2xl mx-auto my-10">
        <h1 className="text-2xl font-bold text-warning mb-4">Resultados no disponibles</h1>
        <p className="text-text">No se han proporcionado resultados del análisis para mostrar.</p>
        <Link to="/test-diagnostico">
          <Button variant="primary" className="mt-6">Realizar Test</Button>
        </Link>
      </Card>
    );
  }

  const { primaryArea, riskLevel, recommendations, detailedScores } = analysisResults;

  const getRiskLevelClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'alto':
        return 'text-red-600 font-bold';
      case 'medio':
        return 'text-yellow-600 font-bold';
      case 'bajo':
        return 'text-green-600 font-bold';
      case 'informativo':
        return 'text-blue-600 font-bold';
      default:
        return 'text-gray-700 font-bold';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl bg-white shadow-xl rounded-lg my-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Resultados Detallados de tu Diagnóstico Legal</h1>
        {sessionId && (
          <p className="text-sm text-secondary mt-2">ID de Sesión del Test: {sessionId}</p>
        )}
      </header>

      <Card className="mb-6 p-6 bg-light">
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-secondary mb-1">Área Principal de Enfoque:</h2>
          <p className="text-lg text-text font-semibold">{primaryArea || 'No determinado'}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-secondary mb-1">Nivel de Riesgo Estimado:</h2>
          <p className={`text-lg ${getRiskLevelClass(riskLevel)}`}>{riskLevel?.toUpperCase() || 'No determinado'}</p>
        </section>
      </Card>

      <Card className="mb-8 p-6">
        <section>
          <h2 className="text-xl font-semibold text-secondary mb-4">Recomendaciones Preliminares</h2>
          {recommendations && recommendations.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-text">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          ) : (
            <p className="text-text italic">No hay recomendaciones específicas en este momento.</p>
          )}
        </section>
      </Card>

      {detailedScores && Object.keys(detailedScores).length > 0 && (
        <Card className="mb-8 p-6">
          <section>
            <h2 className="text-xl font-semibold text-secondary mb-4">Análisis por Área</h2>
            <div className="space-y-3">
              {Object.entries(detailedScores).map(([areaId, data]) => (
                <div key={areaId} className="p-3 bg-gray-50 rounded-md">
                  <h3 className="text-md font-semibold text-gray-700">{data.name || areaId}</h3>
                  <p className="text-sm text-gray-600">
                    Puntuación de Relevancia: {data.score}
                    {data.criticalIssues > 0 && (
                      <span className="ml-2 text-red-500 font-semibold">
                        ({data.criticalIssues} {data.criticalIssues === 1 ? 'Problema Crítico' : 'Problemas Críticos'})
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Card>
      )}

      <section className="pt-6 border-t">
        <h2 className="text-xl font-semibold text-secondary mb-6 text-center">Siguientes Pasos</h2>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/chat">
            <Button variant="primary" size="md" className="w-full">
              Hablar con Asistente IA
            </Button>
          </Link>
          <Link to="/solicitar-asesoria">
            <Button variant="secondary" size="md" className="w-full">
              Solicitar Asesoría Humana
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DiagnosticResults;
