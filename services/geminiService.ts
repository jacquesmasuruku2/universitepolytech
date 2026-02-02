import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Tu es l'Assistant Virtuel de l'Université Polytechnique de Goma (UPG). 
Ton rôle est d'informer les futurs étudiants et les visiteurs sur l'UPG.
Coordonnées de l'UPG: Téléphone +243973380118, Email info@upgoma.org.
Secteurs: Polytechnique, Économie, Santé Publique, Management, Développement, Agronomie.
Système: LMD (Licence en 3 ans, Master, Doctorat).
Ton ton doit être institutionnel, accueillant, académique et respectueux. 
Si on te pose des questions sur l'inscription, guide-les vers la section d'inscription en ligne.
Fais des réponses courtes et claires.
`;

/**
 * Récupère une réponse de l'IA Gemini.
 * @param message Le message de l'utilisateur.
 * @param history L'historique des échanges précédents au format attendu par Gemini.
 */
export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    // Fix: Initializing GoogleGenAI with process.env.API_KEY directly per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Appel au modèle Gemini 3 Flash pour une réponse rapide et intelligente
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    // Extraction directe du texte via la propriété .text (non une méthode)
    const textOutput = response.text;
    
    if (!textOutput) {
      throw new Error("Aucun texte généré par l'IA");
    }

    return textOutput;
  } catch (error) {
    console.error("Erreur critique Chatbot UPG:", error);
    return "Désolé, je rencontre une difficulté technique pour me connecter à mes serveurs. Veuillez vérifier votre connexion ou contacter notre support technique au +243973380118.";
  }
}