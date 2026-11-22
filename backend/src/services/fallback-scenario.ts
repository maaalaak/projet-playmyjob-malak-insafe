import type { Offer } from '../models/offer.ts';
import type { CharacterReply, GaugeEffects, Scenario, SimulationResult } from '../models/scenario.ts';
import type { Exchange, Simulation } from '../models/simulation.ts';

// Contenu utilisé quand Gemini et Groq sont tous les deux indisponibles : la partie ne bloque jamais.

const SHORT_REPLY_LENGTH: number = 25;
const GAME_OVER_PENALTY: number = 10;

function sameEffect(value: number): GaugeEffects {
  return { team: value, client: value, time: value, quality: value };
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

export function buildFallbackScenario(offer: Offer): Scenario {
  return {
    setting: `${offer.company}, ${offer.city}`,
    intro: `C'est ta première journée comme ${offer.title}. Ton équipe compte sur toi : chaque décision compte.`,
    characters: [
      { id: 'claire', name: 'Claire', role: 'Responsable', avatar: '🧑‍💼' },
      { id: 'yanis', name: 'Yanis', role: 'Collègue', avatar: '🧑‍🔧' },
      { id: 'martin', name: 'M. Martin', role: 'Personne accompagnée', avatar: '🙋' },
    ],
    events: [
      {
        time: '08:30',
        characterId: 'claire',
        message: `Bienvenue ! Voici le planning de ta journée de ${offer.title}. Par quoi commences-tu, et pourquoi ?`,
        urgent: false,
        document: {
          title: 'Planning de la journée',
          content: "Réunion d'équipe à 10h. Deux demandes en retard depuis hier. Un dossier important à rendre avant 16h.",
        },
      },
      {
        time: '09:45',
        characterId: 'martin',
        message: "Bonjour, j'attends depuis un moment et personne ne m'a répondu. Vous pouvez m'aider tout de suite ?",
        urgent: true,
        document: null,
      },
      {
        time: '11:00',
        characterId: 'yanis',
        message: 'Je suis débordé, tu peux reprendre une de mes tâches ? Sinon on ne finira jamais à temps.',
        urgent: false,
        document: null,
      },
      {
        time: '13:30',
        characterId: 'claire',
        message: 'On a reçu une remarque sur la qualité de notre travail. Comment éviter que ça se reproduise ?',
        urgent: false,
        document: {
          title: 'Remarque reçue',
          content: 'Délais non respectés deux fois ce mois-ci, et des informations manquantes dans le dernier rendu.',
        },
      },
      {
        time: '15:00',
        characterId: 'martin',
        message: "Il y a une erreur dans ce que vous m'avez fourni. Je veux une solution maintenant.",
        urgent: true,
        document: null,
      },
      {
        time: '17:00',
        characterId: 'yanis',
        message: "Avant de partir : qu'est-ce que tu retiens de ta journée, et que ferais-tu autrement ?",
        urgent: false,
        document: null,
      },
    ],
  };
}

export function fallbackReply(reply: string, timedOut: boolean, previousExchanges: readonly Exchange[]): CharacterReply {
  if (timedOut) {
    return { reply: "Tu ne m'as pas répondu… Je vais devoir me débrouiller.", mood: 'agace', effects: sameEffect(-10), skill: 'Réactivité' };
  }

  const repeated: boolean = previousExchanges.some((exchange: Exchange) => normalize(exchange.reply) === normalize(reply));
  if (repeated) {
    return { reply: "Tu m'as déjà dit ça… Ça ne répond pas vraiment à ma situation.", mood: 'inquiet', effects: sameEffect(-10), skill: 'Adaptation' };
  }

  if (reply.trim().length < SHORT_REPLY_LENGTH) {
    return { reply: "D'accord… Tu peux m'en dire un peu plus ?", mood: 'neutre', effects: sameEffect(-3), skill: 'Précision' };
  }

  return { reply: "Merci, c'est clair. On fait comme ça.", mood: 'content', effects: sameEffect(8), skill: 'Prise de décision' };
}

export function fallbackResult(simulation: Simulation, gameOver: boolean): SimulationResult {
  const { team, client, time, quality } = simulation.gauges;
  const average: number = Math.round((team + client + time + quality) / 4);
  const score: number = Math.max(0, gameOver ? average - GAME_OVER_PENALTY : average);

  const positiveSkills: string[] = simulation.exchanges
    .filter((exchange: Exchange) => Object.values(exchange.effects).some((effect: number) => effect > 0))
    .map((exchange: Exchange) => exchange.skill);
  const strengths: string[] = [...new Set(positiveSkills)].slice(0, 3);

  return {
    title: score >= 70 ? 'Fait pour ce poste' : score >= 45 ? 'Bon potentiel' : 'À la découverte du métier',
    score,
    strengths: strengths.length > 0 ? strengths : ['Curiosité pour le métier'],
    advice:
      score >= 70
        ? 'Tu as pris des décisions claires et adaptées. Postule et prépare des exemples concrets pour l’entretien.'
        : 'Prends le temps de détailler tes décisions et d’expliquer pourquoi. Rejoue pour progresser.',
  };
}
