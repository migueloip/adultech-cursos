import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  relationship?: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, relationship, message }: ContactFormData = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email y mensaje' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json(
        { error: 'Configuración de email no disponible' },
        { status: 500 }
      )
    }

    // Prepare email content
    const emailContent = `
      <h2>Nuevo mensaje de contacto - AdulTech</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
      <p><strong>Relación:</strong> ${relationship || 'No especificada'}</p>
      <h3>Mensaje:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Este mensaje fue enviado desde el formulario de contacto de AdulTech.</em></p>
    `

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'AdulTech <noreply@tu-dominio.com>',
        to: [process.env.CONTACT_EMAIL || 'tu-email@ejemplo.com'],
        subject: `Nuevo mensaje de contacto de ${name}`,
        html: emailContent,
        reply_to: email,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Error sending email with Resend:', errorData)
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully with Resend:', emailResult)

    return NextResponse.json({
      success: true,
      message: 'Email enviado correctamente',
      emailId: emailResult.id
    })

  } catch (error) {
    console.error('Error in contact API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}