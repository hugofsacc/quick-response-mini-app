import { DiagnosticResult, SomaticSymptoms, ToneType } from '../types';

export function calculateDiagnostic(
  answers: Record<number, number>,
  symptoms: SomaticSymptoms
): DiagnosticResult {
  const answeredScores = Object.values(answers);
  const score = answeredScores.reduce((acc, curr) => acc + curr, 0);
  const maxScore = 8;

  const symptomList = Object.entries(symptoms).filter(([_, active]) => active);
  const symptomCount = symptomList.length;

  // Conversational Pressure Index (15% - 98%)
  const rawPressure = 15 + (score / maxScore) * 58 + (symptomCount / 5) * 25;
  const cortisolLoadPercent = Math.min(98, Math.max(15, Math.round(rawPressure)));

  // Communication Clarity & Confidence Index (8% - 96%)
  const rawClarity = 100 - (score / maxScore) * 65 - (symptomCount / 5) * 25;
  const autonomyIndexPercent = Math.min(96, Math.max(8, Math.round(rawClarity)));

  let tier: 1 | 2 | 3 = 1;
  let tierTitle = 'Tier 1: Grounded & Clear Communicator';
  let tierSubtitle = 'High personal clarity, comfortable saying no, and minimal people-pleasing.';
  let summary =
    'You communicate with calm confidence. You understand that saying "no" politely is not an attack, and caring about someone does not require sacrificing your own well-being. You can handle temporary disagreement or disappointment without rushing to apologize or take the blame.';
  let physicalManifestations = [
    'Natural, steady breathing even during tense conversations.',
    'Relaxed jaw and unhurried speaking pace when responding to requests.',
    'Quick return to calm after setting a boundary with someone.',
  ];
  let emotionalDynamics = [
    'Comfort with honesty: You can let others feel their feelings without feeling compelled to rescue them.',
    'Freedom from over-apologizing: Your polite "no" stands as a complete, respectful statement.',
    'Clear perspective: You know that honesty preserves relationships, while false compliance builds resentment.',
  ];
  let recommendedTone: ToneType = 'assertive';

  if (score >= 3 && score <= 5) {
    tier = 2;
    tierTitle = 'Tier 2: Accommodating Communicator (Boundary Fatigue)';
    tierSubtitle = 'Frequent urge to please, taking on extra burdens, and second-guessing your limits.';
    summary =
      'You are paying a heavy "peacekeeping tax." While you want to set clear limits, you often pay for them with hours of second-guessing, lingering guilt, and physical tension. You are likely everyone\'s go-to helper, but you hesitate to say no out of fear of seeming difficult or unkind.';
    physicalManifestations = [
      'Elevated shoulder and neck tension when difficult messages or requests arrive.',
      'A brief feeling of hesitation or tightness in the throat before delivering an honest decline.',
      'Feeling mentally and physically drained after routine family dinners or workplace catchups.',
    ];
    emotionalDynamics = [
      'The "Replay Habit": Mentally reviewing conversations afterward, wondering if you sounded "too harsh."',
      'Over-responsibility: Believing that family or team harmony depends entirely on your cooperation.',
      'Compulsive over-explaining: Providing long backstories and apologies just to soften a valid "no."',
    ];
    recommendedTone = 'assertive';
  } else if (score >= 6) {
    tier = 3;
    tierTitle = 'Tier 3: High-Pressure Communicator (Overloaded)';
    tierSubtitle = 'High conversational strain, feeling cornered easily, and chronic difficulty speaking up.';
    summary =
      'Difficult conversations feel overwhelming and exhausting right now. You frequently walk on eggshells, worried that saying no will trigger cold silence, drama, or accusations. You may have been conditioned to believe that having personal limits makes you selfish. Having clear, pre-crafted words will help you step out of defensive panic and communicate with calm dignity.';
    physicalManifestations = [
      'Tight stomach, clenched jaw, or holding your breath when confronted with an unexpected demand.',
      'Grinding teeth or neck stiffness from unexpressed thoughts and suppressed frustration.',
      'Sudden surges of restlessness or anxiety after you have to turn down a persistent request.',
    ];
    emotionalDynamics = [
      'Automatic yes reflex: Agreeing to things before your brain even has time to check your own availability.',
      'Vulnerability to guilt-trips: Giving in to the silent treatment or cold shoulder just to make the discomfort stop.',
      'Putting yourself last: Feeling guilty for resting or having personal preferences.',
    ];
    recommendedTone = 'steel';
  }

  return {
    score,
    maxScore,
    symptomCount,
    cortisolLoadPercent,
    autonomyIndexPercent,
    tier,
    tierTitle,
    tierSubtitle,
    summary,
    physicalManifestations,
    emotionalDynamics,
    recommendedTone,
  };
}
