/**
 * Serverless API: Envío de correos de contacto
 *
 * Uso: POST /api/send-email
 * Body: { name, email, subject, message }
 *
 * Configuración requerida:
 * 1. Crea una cuenta en https://resend.com (free tier disponible)
 * 2. Obtén tu API key desde el dashboard
 * 3. Añade tu API key como variable de entorno en Vercel:
 *    vercel env add RESEND_API_KEY
 * 4. Añade el dominio desde el cual enviarás correos en Resend
 *
 * Alternativas: Si prefieres no usar Resend, puedes cambiar a
 * Nodemailer con SMTP (Gmail, Outlook, etc.) o SendGrid.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'nekostack07@gmail.com'; // Tu correo de destino

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validación
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nombre, email y mensaje son requeridos.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }

    // Si no hay API key configurada, devolver mensaje de configuración
    if (!RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY no está configurada. Configure la variable de entorno en Vercel.');
      // En desarrollo, simulamos el envío
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 [DEV] Email que se enviaría:', { name, email, subject, message, to: TO_EMAIL });
        return res.status(200).json({
          success: true,
          message: 'Email logged to console (API key not configured)',
          dev: true
        });
      }
      return res.status(500).json({ error: 'Servicio de email no configurado.' });
    }

    // Enviar con Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NekoStack Contact <onboarding@resend.dev>', // Cambia esto por tu dominio verificado
        to: TO_EMAIL,
        subject: subject || `Nuevo mensaje de ${name} desde NekoStack`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0a0a10, #1a1a2e); padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
              <h2 style="color: #e8956d; margin: 0 0 20px; font-size: 24px;">Nuevo mensaje desde tu web</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #8890a8; font-size: 14px; width: 100px;">Nombre</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #f0f2f8; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #8890a8; font-size: 14px;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #f0f2f8; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #e8956d;">${email}</a>
                  </td>
                </tr>
                ${subject ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #8890a8; font-size: 14px;">Asunto</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #f0f2f8; font-size: 14px;">${subject}</td>
                </tr>
                ` : ''}
              </table>
              <div style="margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                <p style="color: #8890a8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Mensaje</p>
                <p style="color: #f0f2f8; font-size: 15px; line-height: 1.7; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #e8956d, #d4784e); color: #050508; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 10px;">
                  Responder a ${name}
                </a>
              </div>
            </div>
            <p style="color: #404468; font-size: 12px; text-align: center; margin-top: 20px;">
              Enviado desde tu web NekoStack · ${new Date().toLocaleDateString('es-MX')}
            </p>
          </div>
        `,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return res.status(500).json({ error: 'Error al enviar el email.' });
    }

    const data = await response.json();
    console.log('Email sent successfully:', data.id);

    return res.status(200).json({
      success: true,
      message: 'Email enviado correctamente.',
      id: data.id
    });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
