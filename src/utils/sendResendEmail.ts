
/**
 * Envia email usando a API do resend.com
 * ATENÇÃO: Use somente uma API key pública!
 */
export async function sendResendEmail({
  to,
  subject,
  html
}: {
  to: string,
  subject: string,
  html: string
}) {
  // COLOQUE SUA API KEY PÚBLICA AQUI:
  const RESEND_API_KEY = "re_ehLzTAo7_KBBRq1d83mBsVvvUbS7Z3SN1"; // Chave atualizada

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "no-reply@sualavanderia.com", // Use um domínio verificado em resend.com
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar email pelo Resend');
  }

  return await response.json();
}
