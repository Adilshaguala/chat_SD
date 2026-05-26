'use client'

import { useRouter } from 'next/navigation'
import { Button, Card } from '@heroui/react'

export default function VerificarEmail() {
  const router = useRouter()

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-6xl">📧</div>

          <h1 className="mb-3 text-2xl font-bold">
            Verifica o teu email
          </h1>

          <p className="mb-8 text-default-500">
            Enviámos um link de confirmação para o teu email.
            <br />
            Clica no link recebido para activar a tua conta.
          </p>

          <div className="flex w-full flex-col gap-3">
            <Button
              // color="primary"
              size="lg"
              onPress={() => router.push('/auth/login')}
            >
              Ir para o Login
            </Button>

          </div>
        </div>
      </Card>
    </div>
  )
}