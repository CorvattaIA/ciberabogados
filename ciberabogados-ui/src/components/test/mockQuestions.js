export const mockQuestions = [
  {
    id: 'q1',
    text: '¿Utiliza contraseñas únicas y complejas para sus diferentes cuentas en línea?',
    type: 'yes-no',
  },
  {
    id: 'q2',
    text: '¿Con qué frecuencia actualiza el software de sus dispositivos (ordenador, móvil, tablet)?',
    type: 'multiple-choice',
    options: [
      { text: 'Automáticamente o tan pronto como hay una actualización', value: 'always' },
      { text: 'A veces, cuando me acuerdo', value: 'sometimes' },
      { text: 'Raramente o nunca', value: 'rarely_never' },
    ],
  },
  {
    id: 'q3',
    text: '¿Ha recibido correos electrónicos o mensajes sospechosos solicitando información personal o financiera (phishing) en los últimos 3 meses?',
    type: 'yes-no',
  },
  {
    id: 'q4',
    text: '¿Utiliza alguna herramienta de gestión de contraseñas?',
    type: 'yes-no',
  },
  {
    id: 'q5',
    text: '¿En qué tipo de redes Wi-Fi suele conectar sus dispositivos cuando está fuera de casa?',
    type: 'multiple-choice',
    options: [
      { text: 'Solo redes Wi-Fi privadas y seguras (protegidas con contraseña)', value: 'private_secure' },
      { text: 'Redes Wi-Fi públicas (aeropuertos, cafeterías) sin VPN', value: 'public_no_vpn' },
      { text: 'Redes Wi-Fi públicas, pero siempre usando una VPN', value: 'public_with_vpn' },
      { text: 'No suelo conectarme a redes Wi-Fi fuera de casa', value: 'no_wifi_outside' },
    ],
  },
];
