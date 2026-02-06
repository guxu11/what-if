// GLM (Guidance & Learning Model) - Generate outcomes and reflections for custom scenarios

export function generateOutcome(choice) {
  const outcomes = [
    `You chose: ${choice}. Life unfolds in ways you couldn't predict. There are challenges, yes, but also unexpected joys.`,
    `Following the path of "${choice}" brings change. Some things improve, others get harder. That's how life works.`,
    `With this choice, you've set yourself on a new journey. The destination isn't clear yet, but each step matters. You chose: ${choice}.`,
  ];

  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

export function generateReflection(choice, question) {
  return `You chose "${choice}" from the crossroads: "${question}".\n\nEvery choice closes some doors but opens others. The path not taken will always hold some mystery - that's normal. What matters is how fully you embrace the path you're walking right now. The present moment is all you truly have. Use it well.`;
}

export function generateDeepReflection(choice, question) {
  const reflections = [
    `The choice of "${choice}" reveals something about your values. Perhaps you prioritize security, or growth, or adventure, or connection. These are all valid. The key insight is this: you made this choice for a reason. Trust yourself. The path you're on is the right one simply because it's the one you're on.`,
    `Exploring "${choice}" has shown you something important: every decision has trade-offs. There is no perfect choice, only the one you make. The "what if" will always exist - it's part of being human. But here's the secret: even if you'd chosen differently, you'd still wonder. So stop wondering. Start living.`,
    `Through "${choice}" you've learned that life isn't about making the perfect decision. It's about making a decision and making it right. The future you imagined might not have happened anyway. What actually happened - what's happening right now - is the only reality. Focus here. This is where life happens.`,
    `Your exploration of "${choice}" at the crossroads of "${question}" reveals a truth: we imagine alternate paths as either better or worse, but they're just different. The grass isn't greener elsewhere - it's greener where you water it. Whatever path you take, bring your best self. That's all anyone can do.`,
  ];

  return reflections[Math.floor(Math.random() * reflections.length)];
}

export function createCustomScenario(title, question, options) {
  const choices = options
    .filter(opt => opt.trim())
    .map((option, index) => ({
      text: option,
      outcome: `option${index + 1}`,
      next: {
        text: generateOutcome(option),
        choices: [
          {
            text: "Accept this outcome",
            outcome: `accept${index + 1}`,
            reflection: generateReflection(option, question),
          },
          {
            text: "Want to explore further",
            outcome: `explore${index + 1}`,
            reflection: generateDeepReflection(option, question),
          },
        ],
      },
    }));

  return {
    id: `custom-${Date.now()}`,
    title,
    description: question,
    icon: "🎨",
    color: "#9b59b6",
    isCustom: true,
    start: {
      text: question,
      choices,
    },
  };
}
