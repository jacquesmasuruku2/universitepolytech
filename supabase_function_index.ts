import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Fix: Declare Deno to satisfy TypeScript in non-Deno specific project configurations
declare const Deno: any;

/**
 * CONFIGURATION MAILJET OFFICIELLE UPG
 * C'est ici que vos clés API sont intégrées pour l'envoi des emails.
 */
const MJ_APIKEY_PUBLIC = "01141e4b8a1381e3596d99c5d9404953";
const MJ_APIKEY_PRIVATE = "260b747f0583adbd78592455dec1dac0";
const MAILJET_API_URL = "https://api.mailjet.com/v3.1/send";

// Fix: Using type assertion (Deno as any) and removing lib reference to bypass TypeScript errors in hybrid development environments
(Deno as any).serve(async (req: Request) => {
  // Gestion du CORS pour permettre au site d'appeler cette fonction
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'POST', 
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' 
      } 
    })
  }

  try {
    // Récupération des données du candidat envoyées depuis RegistrationForm.tsx
    const { email, firstName, lastName, faculty, department } = await req.json();

    // Préparation de l'authentification Mailjet
    const authHeader = btoa(`${MJ_APIKEY_PUBLIC}:${MJ_APIKEY_PRIVATE}`);

    // Construction de l'email avec le message exact demandé
    const payload = {
      Messages: [
        {
          From: {
            Email: "jacquesmasuruku2@gmail.com",
            Name: "Université Polytechnique de Goma (UPG)"
          },
          To: [{ Email: email, Name: `${firstName} ${lastName}` }],
          Subject: "Candidature Envoyée ! - UPG",
          HTMLPart: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #002B5B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="background-color: #002B5B; padding: 30px; text-align: center;">
                <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Candidature Envoyée !</h1>
              </div>
              <div style="padding: 40px; background-color: #ffffff; text-align: center;">
                <h2 style="color: #002B5B; font-size: 22px; margin-bottom: 20px;">Félicitations ${firstName} ${lastName}</h2>
                <p style="font-size: 16px; color: #444; line-height: 1.8; margin-bottom: 25px;">
                  Votre dossier a été enregistré avec succès pour la faculté de <strong>${faculty}</strong>.
                </p>
                <div style="background-color: #f8f9fa; border-left: 5px solid #D4AF37; padding: 20px; margin: 25px 0; text-align: left;">
                  <p style="margin: 0; font-size: 14px; color: #002B5B;"><strong>Département choisi :</strong> ${department}</p>
                </div>
                <p style="font-size: 15px; color: #666; margin-top: 30px;">
                  Un email de confirmation vient de vous être envoyé. Notre commission académique examinera vos pièces justificatives sous peu.
                </p>
              </div>
              <div style="background-color: #002B5B; padding: 20px; text-align: center; font-size: 11px; color: #ffffff; letter-spacing: 1px; opacity: 0.9;">
                © ${new Date().getFullYear()} UNIVERSITÉ POLYTECHNIQUE DE GOMA<br/>
                Excellence & Innovation Technologique
              </div>
            </div>
          `
        }
      ]
    };

    // Envoi de la requête à Mailjet
    const response = await fetch(MAILJET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, result }), { 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
});