import { HiringDecision } from '../interfaces/hiring-decision';

/** Les mêmes seuils que le cercle du score : vert dès 70, orange dès 45. */
const HIRED_SCORE: number = 70;
const TRIAL_SCORE: number = 45;

export function hiringDecision(score: number): HiringDecision {
  if (score >= HIRED_SCORE) {
    return { level: 'hired', stamp: '🎉 Embauché·e !', speech: "Bravo, super journée. On te garde dans l'équipe !" };
  }
  if (score >= TRIAL_SCORE) {
    return {
      level: 'trial',
      stamp: "🤝 Période d'essai prolongée",
      speech: 'Pas mal du tout. On se laisse encore un peu de temps pour décider.',
    };
  }
  return {
    level: 'declined',
    stamp: "🔍 Ce poste n'est peut-être pas pour toi",
    speech: "Merci pour ta journée. Ce poste ne te correspond peut-être pas, mais un autre t'attend.",
  };
}
