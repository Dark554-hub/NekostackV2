# 🚀 NekoStack — Portafolio Personal

Portafolio personal de Emiliano Cab Martinez con animaciones 3D, liquid glass UI y backend serverless para envío de correos.

## ✨ Características

- **Animaciones 3D con Three.js** — Partículas flotantes y formas geométricas en el hero, parallax con scroll
- **Liquid Glass UI** — Glassmorphism premium con blur, transparencias y bordes iridiscentes
- **GSAP ScrollTrigger** — Animaciones de entrada, parallax y transiciones suaves
- **Backend Serverless** — API endpoint para envío de correos (Vercel + Resend)
- **Diseño responsive** — Mobile-first, optimizado para todos los dispositivos
- **UI/UX nivel Apple** — Tipografía, espaciado y transiciones de alta calidad

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (custom properties), JavaScript vanilla
- **3D**: Three.js (WebGL particles + geometric shapes)
- **Animaciones**: GSAP + ScrollTrigger
- **Backend**: Vercel Serverless Functions (Node.js)
- **Email**: Resend API

## 📦 Instalación Local

### 1. Clona o descarga el proyecto

```bash
cd NekoStack
```

### 2. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
RESEND_API_KEY=tu_api_key_de_resend
```

### 3. Obtener API Key de Resend

1. Ve a [resend.com](https://resend.com) y crea una cuenta
2. En el dashboard, crea un nuevo API key
3. Añade un dominio o usa `onboarding@resend.dev` para pruebas
4. Copia la API key a tu `.env`

### 4. Ejecutar localmente

```bash
# Con Vercel CLI
npm i -g vercel
vercel dev

# O abre directamente el index.html en tu navegador
```

## 🚀 Despliegue a Vercel

### Opción 1: Desde la CLI

```bash
# Login
vercel login

# Deploy
vercel

# Configurar variable de entorno
vercel env add RESEND_API_KEY
```

### Opción 2: Desde GitHub

1. Sube el proyecto a un repositorio en GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa el repositorio
4. Añade la variable de entorno `RESEND_API_KEY` desde el dashboard
5. Deploy automático en cada push

## 📧 Configuración del Email

### Usando Resend (Recomendado)

1. Crea cuenta en [resend.com](https://resend.com)
2. Crea un API key desde el dashboard
3. (Opcional) Añade y verifica tu dominio para enviar desde tu propio email
4. Añade `RESEND_API_KEY` como variable de entorno en Vercel

### Usando Gmail/SMTP (Alternativa)

Si prefieres no usar Resend, modifica `api/send-email.js` para usar Nodemailer:

```bash
npm install nodemailer
```

Y cambia el código del fetch por:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS // Usa App Password, no tu password normal
  }
});

await transporter.sendMail({
  from: '"NekoStack" <tu@gmail.com>',
  to: TO_EMAIL,
  subject: subject || `Nuevo mensaje de ${name}`,
  html: `...`
});
```

## 📁 Estructura del Proyecto

```
NekoStack/
├── index.html          # Frontend principal
├── api/
│   └── send-email.js   # Serverless API para correos
├── vercel.json         # Configuración de Vercel
├── logo.png            # Logo de NekoStack
├── tu_foto.png         # Tu foto personal
├── Cv.pdf              # Tu CV
└── README.md           # Este archivo
```

## 🎨 Personalización

### Cambiar colores

Edita los CSS custom properties en `:root`:

```css
:root {
  --bg: #050508;        /* Color de fondo */
  --or: #e8956d;        /* Color accent (naranja) */
  --t1: #f0f2f8;        /* Color de texto principal */
  --t2: #8890a8;        /* Color de texto secundario */
}
```

### Cambiar contenido

Edita directamente el `index.html` — todo el contenido está en HTML semántico.

### Cambiar animaciones

- **Hero 3D**: Edita la función `Three.js` en el `<script>` final
- **Scroll animations**: Edita los `gsap.from()` y `ScrollTrigger` en el mismo bloque
- **Glass effects**: Ajusta los valores en `.glass-*` classes

## 🔧 Troubleshooting

### "API key not configured"
Añade `RESEND_API_KEY` a tus variables de entorno en Vercel.

### El email no llega
1. Verifica que la API key sea correcta
2. Si usas `onboarding@resend.dev`, asegúrate de que el destinatario confirme el email
3. Revisa la consola de Resend para errores

### Animaciones lentas
Reduce `particleCount` en Three.js (línea ~820 del script) a 200.

## 📄 Licencia

© 2025 Emiliano Cab Martinez. Todos los derechos reservados.
