// Pre-built scenario templates for the What-If Game
// Each scenario has branching paths that lead to different outcomes

export const scenarios = {
  // Scenario 1: Career Crossroads
  career: {
    id: 'career',
    title: 'The Career Crossroads',
    description: "You've been offered a promotion at your stable company, but also have a chance to join an exciting startup. Both paths offer different futures.",
    icon: '💼',
    color: '#3498db',
    start: {
      text: "It's Monday morning. You walk into your office and find two envelopes on your desk:\n\n📩 Envelope 1: A promotion offer to Senior Manager - 40% raise, stability, benefits, but more responsibility and stress.\n\n📩 Envelope 2: An offer from a promising startup - equity potential, exciting work, but risky and lower salary.\n\nYour current job is comfortable but you've felt stagnant lately. Your family depends on your income.",
      choices: [
        {
          text: 'Take promotion - Security matters most',
          outcome: 'promotion_stable',
          next: {
            text: 'You accept the promotion. The raise helps your family immediately. The first few months are stressful as you adjust to new responsibilities.\n\nThree years pass. You\'re respected, financially secure, but sometimes wonder if you missed an adventure.',
            choices: [
              {
                text: 'Feel satisfied with your choice',
                outcome: 'promotion_satisfied',
                reflection: 'You chose stability and found contentment. Your family benefited, and you built lasting relationships at work. The path you took gave you the foundation to help others.'
              },
              {
                text: 'Regret not taking the risk',
                outcome: 'promotion_regret',
                reflection: 'The safety of your path became a cage of "what ifs." Yet looking back, you realize every choice has trade-offs. The startup might have failed - you can never know. What matters is what you built with the choice you made.'
              }
            ]
          }
        },
        {
          text: 'Join startup - Adventure calls',
          outcome: 'startup_risk',
          next: {
            text: 'You take the leap! The startup is exciting and challenging. Your family worries about the risk.\n\nTwo years in: The company struggles. You work long hours for uncertain reward. But you\'ve learned so much and made incredible connections.',
            choices: [
              {
                text: 'Push through - Belief in the vision',
                outcome: 'startup_success',
                reflection: 'The startup eventually succeeds beyond expectations. Your equity pays off. But more importantly, you proved to yourself you could embrace uncertainty. The journey taught you resilience you never knew you had.'
              },
              {
                text: 'Return to corporate - Lessons learned',
                outcome: 'startup_return',
                reflection: 'The startup failed, but you returned to corporate with new skills and confidence. The "failure" was actually valuable experience. You now approach work differently - more creatively, less fearfully.'
              }
            ]
          }
        },
        {
          text: 'Propose a third option - Negotiate',
          outcome: 'creative_negotiation',
          next: {
            text: 'You ask for time to think. Then you propose something unexpected: keep your current role but take on a special project, or work part-time with the startup while maintaining stability.\n\nNeither works out perfectly, but the conversation opens new doors.',
            choices: [
              {
                text: 'Find a middle ground that satisfies neither fully',
                outcome: 'middle_ground',
                reflection: 'You avoided the binary choice and created something unique. It wasn\'t perfect - life never is - but it was yours. Sometimes the best path is the one you forge yourself, even when it\'s messy.'
              },
              {
                text: 'Realize you must choose eventually',
                outcome: 'eventual_choice',
                reflection: 'Delaying revealed your true priorities. When you finally chose, it was clearer because you\'d taken time to understand what actually mattered. The waiting wasn\'t wasted - it was preparation.'
              }
            ]
          }
        }
      ]
    }
  },

  // Scenario 2: Relationship Decision
  relationship: {
    id: 'relationship',
    title: 'The Relationship Fork',
    description: "You're in a long-term relationship that's grown distant. You've met someone new who makes you feel alive again. Or maybe you just need space to figure yourself out.",
    icon: '❤️',
    color: '#e74c3c',
    start: {
      text: "You've been with Alex for 5 years. You have history, shared memories, a life built together. But lately, you've been drifting apart.\n\nThen you met Jordan. Conversation flows easily. You feel seen in ways you haven't felt in years. There's an undeniable connection.\n\nOr maybe the problem isn't a new person at all. Maybe you just need time alone to rediscover yourself.\n\nYour friends say: \"Follow your heart.\" But your heart is confused.",
      choices: [
        {
          text: 'Stay with Alex - Work on the relationship',
          outcome: 'stay_commit',
          next: {
            text: 'You choose commitment. It\'s hard work. Honest conversations, therapy, rediscovering each other. Some days you wonder if you made the right choice.\n\nA year passes. Things are different - not perfect, but more real. You\'ve grown together through the difficulty.',
            choices: [
              {
                text: 'Find new depth in the commitment',
                outcome: 'renewed_love',
                reflection: 'Relationships aren\'t about finding the perfect person - they\'re about building something real. By choosing to stay and work, you discovered that love is a verb, not a feeling. The history you have became a foundation, not a chain.'
              },
              {
                text: 'Realize staying was a mistake',
                outcome: 'stay_regret',
                reflection: 'Even staying can be a form of "what if" - what if you\'d left? But here\'s the truth: there is no perfect choice. Whatever path you take, you\'ll wonder about the other. The key is making peace with the path you\'re on.'
              }
            ]
          }
        },
        {
          text: 'Leave for Jordan - Follow the spark',
          outcome: 'follow_spark',
          next: {
            text: 'You end it with Alex. The breakup is painful - you\'re hurting someone you care about. But Jordan makes you feel alive again.\n\nSix months with Jordan: The excitement is real, but so are the challenges. Real life intrudes. New relationships have their own problems.',
            choices: [
              {
                text: 'Build something real with Jordan',
                outcome: 'new_relationship',
                reflection: 'The spark became a flame, then a steady fire. You learned that new love isn\'t automatically better - it\'s just different. The courage to leave gave you the chance to build something authentic, even if it wasn\'t guaranteed.'
              },
              {
                text: 'Realize the spark wasn\'t enough',
                outcome: 'spark_fades',
                reflection: 'Jordan wasn\'t "the one" - just "one." You learned that following feelings isn\'t the same as following wisdom. The experience taught you about your own patterns. Sometimes you have to make a mistake to understand what you actually need.'
              }
            ]
          }
        },
        {
          text: 'Choose yourself - Be single for a while',
          outcome: 'choose_solo',
          next: {
            text: 'You break up with Alex. You don\'t pursue Jordan either. Instead, you choose to be alone for the first time in years.\n\nIt\'s harder than expected. Loneliness hits hard. But slowly, you rediscover parts of yourself you\'d forgotten.',
            choices: [
              {
                text: 'Thrive in solitude',
                outcome: 'solo_growth',
                reflection: 'Being alone didn\'t mean being lonely. You learned to be your own company, your own validation. This period of solitude was the most important relationship of your life - the one with yourself.'
              },
              {
                text: 'Crave connection again',
                outcome: 'solo_return',
                reflection: 'Solitude taught you what you actually want from connection. When you eventually re-enter the dating world, you do it differently. Not from desperation or habit, but from a place of wholeness. That made all the difference.'
              }
            ]
          }
        }
      ]
    }
  },

  // Scenario 3: Relocation Dilemma
  relocation: {
    id: 'relocation',
    title: 'The Great Relocation',
    description: 'You have the opportunity to move to a new city (or country) for work or adventure. Stay in your familiar life with its comforts and community, or start fresh somewhere unknown?',
    icon: '🌍',
    color: '#27ae60',
    start: {
      text: "The email arrives: An opportunity in another city. Could be your dream job, or a chance to live somewhere you've always wanted to be.\n\nYour current life: Familiar. Comfortable. You have friends here, favorite spots, routines. Nothing is wrong, exactly.\n\nThe new place: Unknown. Exciting but scary. You'd start over - new job, new home, new social circle. No guarantees.\n\nYour family has opinions. Your friends will miss you. You'll miss them.\n\nBut the window is closing. You need to decide soon.",
      choices: [
        {
          text: 'Move - Embrace the adventure',
          outcome: 'move_adventure',
          next: {
            text: 'You pack your life into boxes. Say goodbye to friends. The journey is exhausting but exhilarating.\n\nFirst months in the new city: It\'s harder than you imagined. Loneliness hits. You question everything. But slowly, you build a new life.',
            choices: [
              {
                text: 'Thrive in the new environment',
                outcome: 'new_city_success',
                reflection: 'The new city became home in ways you didn\'t expect. You discovered parts of yourself that only emerged in unfamiliar territory. The adventure wasn\'t just about the place - it was about becoming someone new through the experience of being somewhere new.'
              },
              {
                text: 'Return home - Wiser',
                outcome: 'return_home',
                reflection: 'You tried, you struggled, and you came back. Some might call it failure - you know it was bravery. The attempt taught you what you actually value. Home isn\'t where you\'re from - it\'s where you choose to be.'
              }
            ]
          }
        },
        {
          text: 'Stay - Value what you have',
          outcome: 'stay_put',
          next: {
            text: 'You decline the opportunity. Part of you wonders "what if?" But another part feels relief. Stay in your familiar life.\n\nMonths pass. Life continues. You deepen connections, find new growth in familiar places. The opportunity fades from memory.\n\nBut sometimes, late at night...',
            choices: [
              {
                text: 'Find fulfillment in staying',
                outcome: 'stay_content',
                reflection: 'There\'s depth in staying that adventure-seekers miss. You invested in relationships, community, the gradual growth that comes from continuity. The grass isn\'t greener - it\'s just different grass. Yours was pretty good all along.'
              },
              {
                text: 'Always wonder about the path not taken',
                outcome: 'wonder_forever',
                reflection: 'The "what if" never fully goes away. But here\'s what you learned: every path has its own "what ifs." Even if you\'d moved, you\'d wonder about the life you left. The haunting isn\'t about the choice - it\'s about the human capacity to imagine alternatives. That\'s not a bug. It\'s how we grow.'
              }
            ]
          }
        },
        {
          text: 'Compromise - Extended visit first',
          outcome: 'test_visit',
          next: {
            text: 'You negotiate: Can you try it for 3 months? Keep your current setup, take a leave of absence, test the waters.\n\nThe visit reveals truths no amount of imagining could. You experience the reality, not the fantasy.',
            choices: [
              {
                text: 'The visit confirms - Move permanently',
                outcome: 'visit_confirm_move',
                reflection: 'The trial period was perfect. It removed the fear of the unknown while showing you the reality. You moved with eyes open, not caught up in fantasy. The decision felt right because it was informed, not impulsive.'
              },
              {
                text: 'The visit reveals - Stay where you are',
                outcome: 'visit_confirm_stay',
                reflection: 'Experiencing the new place stripped away the romanticized version. You realized what you\'d miss. The visit gave you closure on the "what if" without upending your life. Sometimes the best decision is the one that feels like relief, not excitement.'
              }
            ]
          }
        }
      ]
    }
  },

  // Epic: The King's Destiny
  epic: {
    id: 'epic',
    title: "The King's Destiny",
    description: "A medieval epic of political intrigue, rebellion, and destiny. Multiple chapters with deep consequences.",
    icon: '🏰',
    color: '#9b59b6',
    start: {
      text: "You are a simple farmer living in the village of Eldermere. One morning, your grandfather calls you to his deathbed.\n\n'I have something to tell you,' he says, his voice barely above a whisper. 'Something I've kept secret your entire life.'\n\nHe hands you an old letter, sealed with wax bearing a royal crest.\n\n'You are not who you think you are,' he continues. 'Your parents... they were royalty. They hid you away to protect you from those who would do you harm.'\n\n'I don't understand,' you say, confused.\n\n'The King is dying,' your grandfather says. 'He has no heir. But you... you are the rightful heir to the throne. This letter proves it.'\n\nHe squeezes your hand weakly. 'The choice is yours, child. Claim your birthright, or stay here and live the simple life you've always known.'",
      choices: [
        {
          text: 'Accept my destiny',
          outcome: 'accepted_destiny',
          next: {
            text: "You take the letter and kiss your grandfather's forehead. 'I'll make you proud,' you promise.\n\nYour grandfather smiles weakly. 'I know you will. But remember - power corrupts even the best of hearts. Stay true to yourself, no matter what the crown demands.'\n\nThat night, your grandfather passes away peacefully. The next morning, you gather your few belongings and begin the journey to the capital. You're afraid, but also filled with a strange sense of purpose.\n\nAs you leave the village, you can't help but look back one last time at the only home you've ever known. Your old life is ending - and your true life is just beginning.",
            choices: [
              {
                text: 'Travel to the capital quickly',
                outcome: 'quick_journey',
                reflection: 'The journey to the capital takes two weeks. When you finally reach it, the city is more impressive than you imagined. The castle looms above everything. When you show the letter to the guard, he immediately escorts you to the throne room.\n\nThe King confirms your identity and prepares for your coronation. You sit on the throne the next day, terrified but determined. You rule for thirty years, bringing prosperity to the kingdom. You never forgot your grandfather\'s warning about power, and you always stayed connected to the people.\n\nThe simple farmer\'s child became a great king - not because of royal blood, but because of a good heart.'
              },
              {
                text: 'Visit the nearest town for information first',
                outcome: 'cautious_journey',
                reflection: 'You spend a day in the nearest town, learning about the political situation. The King is beloved but dying, and factions are already forming. Armed with knowledge, you travel to the capital.\n\nYour strategic thinking impresses the court. The King appoints advisors to guide you, and you spend months learning statecraft before your coronation. Your reign is marked by wise decisions and political stability.\n\nThe simple farmer\'s child became a wise ruler - proving that preparation and knowledge are as important as noble blood.'
              }
            ]
          }
        },
        {
          text: 'This is too much - I need time to think',
          outcome: 'hesitated',
          next: {
            text: "You set the letter down, your mind racing. 'I can't just leave,' you say. 'I don't know anything about ruling, about politics, about any of this. I'm a farmer, grandfather. That's all I've ever been.'\n\n'Being a farmer doesn't make you incapable of greatness,' your grandfather says gently. 'Your parents believed that true leadership comes from the heart, not from noble blood. They chose to hide you because they wanted you to grow up knowing real life - knowing the struggles of the common people.'\n\nHe coughs weakly. 'Take a few days to think about it. The letter will wait. But know this - the kingdom is in danger, and you may be the only one who can save it.'\n\nYou spend the next three days in a daze, going through the motions of farm work while your mind races with impossible choices. Finally, you make your decision.",
            choices: [
              {
                text: 'I must go - the kingdom needs me',
                outcome: 'eventual_acceptance',
                reflection: 'You return to your grandfather and tell him your decision. He smiles, tears in his eyes, and gives you final advice: "Listen to the people. Trust your heart. Never forget where you came from."\n\nThe journey changes you. You see the kingdom through new eyes - the poverty, the corruption, but also the hope. When you finally become king, you rule with deep empathy for your subjects. Your reign transforms the kingdom for the better.\n\nThe farmer who became king understood the people because he was one of them.'
              },
              {
                text: 'I can\'t do this - I\'ll stay',
                outcome: 'declined',
                reflection: 'You decide to stay in Eldermere. The castle, the throne, the responsibility - it\'s all too much. You\'re a farmer, not a king, and no letter can change who you are.\n\nYou burn the letter and continue your life as before. But sometimes, late at night, you wonder: what if you had been brave enough to accept your destiny? What if you could have made a difference?\n\nYou\'ll never know. But perhaps that\'s okay. Not everyone is destined for greatness, and there\'s dignity in an ordinary life lived well.\n\nTHE END - SIMPLE LIFE'
              }
            ]
          }
        }
      ]
    }
  }
};

// Helper function to get scenario by ID
export function getScenario(id) {
  return scenarios[id] || null;
}

// Helper function to get all scenarios (for menu)
export function getAllScenarios() {
  return Object.values(scenarios);
}
