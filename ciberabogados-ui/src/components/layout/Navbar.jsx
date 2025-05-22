import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Using outline icons

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial state for authentication
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', text: 'Inicio' },
    { to: '/test-diagnostico', text: 'Test Diagnóstico' },
    { to: '/asistente-ia', text: 'Asistente IA' },
  ];

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Ciberabogados
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Authentication Section - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
              <Link
                to="/cuenta"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Mi Cuenta
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-secondary hover:bg-secondary-dark text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-primary shadow-lg z-20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark transition-colors"
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                {link.text}
              </Link>
            ))}
          </div>
          {/* Authentication Section - Mobile */}
          <div className="pt-4 pb-3 border-t border-primary-dark">
            {isLoggedIn ? (
              <div className="flex items-center px-5">
                <Link
                  to="/cuenta"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mi Cuenta
                </Link>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="block bg-secondary hover:bg-secondary-dark text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
