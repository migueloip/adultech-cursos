import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  relationship?: string
  message: string
  website?: string // Honeypot field
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, relationship, message, website }: ContactFormData = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email y mensaje' },
        { status: 400 }
      )
    }

    // Honeypot: si el campo 'website' tiene valor, es un bot
    if (website && website.trim() !== '') {
      console.log('Bot detectado por honeypot:', { website, ip: request.headers.get('x-forwarded-for') })
      // Responder como si fuera exitoso para no alertar al bot
      return NextResponse.json(
        { message: 'Mensaje enviado correctamente' },
        { status: 200 }
      )
    }

    // Log de seguridad para monitoreo
    console.log('Formulario de contacto enviado:', {
      name,
      email,
      relationship,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent')
    })

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
        from: process.env.FROM_EMAIL || 'AdulTech <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL || 'anguelmiguel640@gmail.com'],
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