import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  relationship?: string
  message: string
  turnstileToken?: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, relationship, message, turnstileToken }: ContactFormData = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email y mensaje' },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      )
    }

    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (!turnstileSecret) {
      return NextResponse.json(
        { error: 'Configuración de verificación no disponible' },
        { status: 500 }
      )
    }

    // Verify the Turnstile token with Cloudflare
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
      }),
    })

    const turnstileResult = await turnstileResponse.json()
    if (!turnstileResult.success) {
      return NextResponse.json(
        { error: 'Verificación de seguridad fallida' },
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