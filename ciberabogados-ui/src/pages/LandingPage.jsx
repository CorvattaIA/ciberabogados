import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// Placeholder for icons - replace with actual icons later
const PlaceholderIcon = ({ className = "w-12 h-12 text-primary" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const LandingPage = () => {
  return (
    <div className="bg-background text-text">
      {/* Hero Section */}
      <section className="bg-light py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Tu Seguridad Digital, Simplificada por Expertos Legales
          </h1>
          <p className="text-lg md:text-xl text-secondary mb-10 max-w-3xl mx-auto">
            En Ciberabogados, te ofrecemos herramientas y asesoría experta para protegerte en el mundo digital.
            Comienza con nuestro test de diagnóstico gratuito y descubre tu nivel de riesgo.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/test-diagnostico">
              <Button variant="primary" size="lg" className="w-full md:w-auto">
                Realizar Test Diagnóstico Gratuito
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full md:w-auto">
              Más Información
            </Button>
          </div>
          {/* Placeholder for background image/graphic could be a div with bg-cover or an img tag */}
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Cómo te ayudamos?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <PlaceholderIcon />
              <h3 className="text-xl font-semibold mt-4 mb-2">1. Realiza el Test</h3>
              <p className="text-secondary">Completa nuestro test de diagnóstico para identificar tus vulnerabilidades.</p>
            </div>
            <div className="flex flex-col items-center">
              <PlaceholderIcon />
              <h3 className="text-xl font-semibold mt-4 mb-2">2. Obtén tu Diagnóstico</h3>
              <p className="text-secondary">Recibe un informe detallado sobre tu nivel de riesgo y recomendaciones.</p>
            </div>
            <div className="flex flex-col items-center">
              <PlaceholderIcon />
              <h3 className="text-xl font-semibold mt-4 mb-2">3. Chatea con IA</h3>
              <p className="text-secondary">Utiliza nuestro asistente IA para resolver dudas y obtener guía inicial.</p>
            </div>
            <div className="flex flex-col items-center">
              <PlaceholderIcon />
              <h3 className="text-xl font-semibold mt-4 mb-2">4. Asesoría Experta</h3>
              <p className="text-secondary">Conecta con nuestros expertos legales para una asesoría personalizada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="bg-light py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Beneficios Clave
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <PlaceholderIcon />
                <h3 className="text-xl font-semibold mt-4 mb-2">Diagnóstico Preciso</h3>
                <p className="text-secondary">Identifica tus riesgos específicos con nuestro test exhaustivo.</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <PlaceholderIcon />
                <h3 className="text-xl font-semibold mt-4 mb-2">Asistencia Inmediata</h3>
                <p className="text-secondary">Obtén respuestas rápidas y guía de nuestro asistente IA 24/7.</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <PlaceholderIcon />
                <h3 className="text-xl font-semibold mt-4 mb-2">Soporte Legal Especializado</h3>
                <p className="text-secondary">Accede a ciberabogados expertos para casos complejos.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <p className="text-secondary italic">"Increíble servicio, me ayudó a entender mis riesgos y cómo protegerme. ¡Totalmente recomendado!"</p>
              <p className="text-right font-semibold mt-4">- Usuario Anónimo</p>
            </Card>
            <Card className="p-6">
              <p className="text-secondary italic">"La combinación del test y el asistente IA es genial. Pude resolver muchas dudas antes de hablar con un abogado."</p>
              <p className="text-right font-semibold mt-4">- Cliente Satisfecho</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para fortalecer tu seguridad digital?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            No esperes a ser víctima de un ciberataque. Toma el control de tu seguridad hoy mismo.
          </p>
          <Link to="/test-diagnostico">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
              Comienza tu Diagnóstico Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
