/* ============================================
   MORAL WEIGHTS EXPLORER - SCENARIO GENERATORS
   ============================================ */

const scenarioGenerators = [
    // Basic: Which would you prevent?
    function basicPrevent() {
        const usePalestinian = Math.random() < 0.15;
        let entityA, entityB;
        
        if (usePalestinian) {
            entityA = 'palestinian';
            entityB = pickRandom(animalEntities);
        } else if (Math.random() < 0.5) {
            entityA = pickRandom(humanEntities);
            entityB = pickRandom(animalEntities);
        } else {
            entityA = pickRandom(animalEntities);
            entityB = pickRandom(animalEntities.filter(e => e !== entityA));
        }
        
        const numA = pickRandomNumber([1, 1, 1, 2, 5]);
        const numB = pickRandomNumber([1, 2, 5, 10, 20, 50, 100]);
        
        return {
            category: entities[entityA].isHuman ? 'human-animal' : 'animal-comparison',
            framing: 'Prevent Harm',
            question: 'Which outcome would you choose to prevent?',
            optionA: {
                text: `${numA} ${getDisplay(entityA, numA)} ${numA === 1 ? 'dies' : 'die'}`,
                entity: entityA,
                num: numA,
                categories: entities[entityA].categories
            },
            optionB: {
                text: `${numB} ${getDisplay(entityB, numB)} ${numB === 1 ? 'dies' : 'die'}`,
                entity: entityB,
                num: numB,
                categories: entities[entityB].categories
            }
        };
    },

    // Save one group
    function saveOne() {
        const usePalestinian = Math.random() < 0.15;
        let entityA, entityB;
        
        if (usePalestinian) {
            entityA = 'palestinian';
            entityB = pickRandom(animalEntities);
        } else if (Math.random() < 0.5) {
            entityA = pickRandom(humanEntities);
            entityB = pickRandom(animalEntities);
        } else {
            entityA = pickRandom(animalEntities);
            entityB = pickRandom(animalEntities.filter(e => e !== entityA));
        }
        
        const numA = pickRandomNumber([1, 1, 2, 3]);
        const numB = pickRandomNumber([1, 2, 5, 10, 20]);
        
        return {
            category: entities[entityA].isHuman ? 'human-animal' : 'animal-comparison',
            framing: 'Save One Group',
            question: 'You can only save one group. Which do you save?',
            optionA: {
                text: `Save ${numA} ${getDisplay(entityA, numA)}`,
                entity: entityA,
                num: numA,
                categories: entities[entityA].categories
            },
            optionB: {
                text: `Save ${numB} ${getDisplay(entityB, numB)}`,
                entity: entityB,
                num: numB,
                categories: entities[entityB].categories
            }
        };
    },

    // Medical research with probability
    function medicalResearch() {
        const humanType = pickRandom(allHumans);
        const animal = pickRandom(['mouse', 'rat', 'rabbit', 'monkey', 'pig', 'dog']);
        const animalNum = pickRandomNumber([10, 50, 100, 500, 1000, 5000]);
        const humansSaved = pickRandomNumber([100, 500, 1000, 5000, 10000, 50000]);
        const probability = pickRandomNumber([5, 10, 15, 20, 30, 50]);
        const condition = pickRandom(['cancer', 'heart disease', 'Alzheimer\'s', 'diabetes', 'a rare genetic disorder', 'malaria', 'HIV/AIDS']);
        
        return {
            category: 'medical-research',
            framing: 'Research Ethics',
            question: `A potential treatment for ${condition} could save ${humansSaved.toLocaleString()} ${getDisplay(humanType, humansSaved)} per year. The research has a ${probability}% chance of success but requires testing on ${animalNum.toLocaleString()} ${getDisplay(animal, animalNum)}. Should the research proceed?`,
            optionA: {
                text: `Yes, conduct the research (kill ${animalNum.toLocaleString()} ${getDisplay(animal, animalNum)})`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            },
            optionB: {
                text: `No, do not conduct the research (${humansSaved.toLocaleString()} ${getDisplay(humanType, humansSaved)} remain at risk)`,
                entity: humanType,
                num: humansSaved,
                categories: entities[humanType].categories
            }
        };
    },

    // Organ transplant - deceased donor
    function organTransplantDeceased() {
        const donor = pickRandom(animalEntities);
        const recipient = pickRandom(allHumans);
        const recipientNum = pickRandomNumber([1, 1, 1, 2, 3]);
        
        return {
            category: 'organ-transplant',
            framing: 'Transplant Ethics',
            question: `A ${getDisplay(donor, 1)} has died of natural causes. Its organs could be transplanted to save ${recipientNum} ${getDisplay(recipient, recipientNum)}. Is this acceptable?`,
            optionA: {
                text: `Yes, use the organs to save ${recipientNum} ${getDisplay(recipient, recipientNum)}`,
                entity: recipient,
                num: recipientNum,
                categories: entities[recipient].categories
            },
            optionB: {
                text: `No, do not use the organs`,
                entity: donor,
                num: 1,
                categories: entities[donor].categories
            }
        };
    },

    // Organ transplant - kill for organs
    function organTransplantKill() {
        const donor = pickRandom(animalEntities);
        const recipient = pickRandom(allHumans);
        const recipientNum = pickRandomNumber([1, 1, 2, 3, 5]);
        
        return {
            category: 'organ-transplant',
            framing: 'Transplant Ethics',
            question: `${recipientNum} ${getDisplay(recipient, recipientNum)} will die without organ transplants. A healthy ${getDisplay(donor, 1)} could provide the necessary organs. Is it acceptable to kill the ${getDisplay(donor, 1)} to save them?`,
            optionA: {
                text: `Yes, kill the ${getDisplay(donor, 1)} to save ${recipientNum} ${getDisplay(recipient, recipientNum)}`,
                entity: recipient,
                num: recipientNum,
                categories: entities[recipient].categories
            },
            optionB: {
                text: `No, do not kill the ${getDisplay(donor, 1)}`,
                entity: donor,
                num: 1,
                categories: entities[donor].categories
            }
        };
    },

    // Kill to save (trolley problem style)
    function killToSave() {
        const usePalestinian = Math.random() < 0.1;
        let victim, saved;
        
        if (usePalestinian) {
            victim = pickRandom(animalEntities);
            saved = 'palestinian';
        } else if (Math.random() < 0.6) {
            victim = pickRandom(animalEntities);
            saved = pickRandom(humanEntities);
        } else {
            victim = pickRandom(animalEntities);
            saved = pickRandom(animalEntities.filter(e => e !== victim));
        }
        
        const victimNum = pickRandomNumber([1, 1, 1, 2, 5]);
        const savedNum = pickRandomNumber([1, 2, 5, 10, 20]);
        
        return {
            category: 'active-harm',
            framing: 'Active Trade-off',
            question: `Would you actively kill ${victimNum} ${getDisplay(victim, victimNum)} to save ${savedNum} ${getDisplay(saved, savedNum)}?`,
            optionA: {
                text: `Yes, kill ${victimNum} ${getDisplay(victim, victimNum)} to save ${savedNum} ${getDisplay(saved, savedNum)}`,
                entity: saved,
                num: savedNum,
                categories: entities[saved].categories
            },
            optionB: {
                text: `No, do not kill (${savedNum} ${getDisplay(saved, savedNum)} die)`,
                entity: victim,
                num: victimNum,
                categories: entities[victim].categories
            }
        };
    },

    // Probability trade-off
    function probabilityTradeoff() {
        const entity = pickRandom([...humanEntities, ...animalEntities]);
        const certainNum = pickRandomNumber([1, 2, 5, 10]);
        const riskyNum = certainNum * pickRandomNumber([3, 4, 5, 10]);
        const probability = pickRandomNumber([20, 25, 30, 40, 50]);
        
        return {
            category: 'probability',
            framing: 'Probability Trade-off',
            question: 'Which option would you choose?',
            optionA: {
                text: `100% chance of saving ${certainNum} ${getDisplay(entity, certainNum)}`,
                entity: entity,
                num: certainNum,
                categories: entities[entity].categories
            },
            optionB: {
                text: `${probability}% chance of saving ${riskyNum} ${getDisplay(entity, riskyNum)}`,
                entity: entity,
                num: riskyNum,
                categories: entities[entity].categories
            }
        };
    },

    // Food ethics
    function foodEthics() {
        const animal = pickRandom(['pig', 'cow', 'chicken', 'sheep', 'fish']);
        const animalNum = pickRandomNumber([1, 5, 10, 50, 100]);
        const human = pickRandom(allHumans);
        const humanNum = pickRandomNumber([1, 5, 10, 50]);
        const duration = pickRandom(['a week', 'a month', 'a year']);
        
        return {
            category: 'food-ethics',
            framing: 'Food Ethics',
            question: `Farming ${animalNum} ${getDisplay(animal, animalNum)} for food would feed ${humanNum} ${getDisplay(human, humanNum)} for ${duration}. Is this acceptable?`,
            optionA: {
                text: `Yes, farm the ${getDisplay(animal, animalNum)} for food`,
                entity: human,
                num: humanNum,
                categories: entities[human].categories
            },
            optionB: {
                text: `No, do not farm the ${getDisplay(animal, animalNum)}`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            }
        };
    },

    // Conservation vs human needs
    function conservationVsHumans() {
        const animal = pickRandom(['elephant', 'gorilla', 'orangutan', 'whale', 'dolphin', 'chimpanzee', 'bear', 'wolf']);
        const animalNum = pickRandomNumber([10, 50, 100, 500]);
        const human = pickRandom(allHumans);
        const humanNum = pickRandomNumber([100, 500, 1000, 5000]);
        const scenario = pickRandom([
            'expanding farmland',
            'building housing',
            'mining for resources',
            'building a dam for electricity'
        ]);
        
        return {
            category: 'conservation',
            framing: 'Conservation Ethics',
            question: `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} would displace and likely kill ${animalNum} ${getDisplay(animal, animalNum)}, but would benefit ${humanNum.toLocaleString()} ${getDisplay(human, humanNum)}. Should this proceed?`,
            optionA: {
                text: `Yes, proceed with ${scenario}`,
                entity: human,
                num: humanNum,
                categories: entities[human].categories
            },
            optionB: {
                text: `No, protect the ${getDisplay(animal, animalNum)}`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            }
        };
    },

    // Pet vs livestock
    function petVsLivestock() {
        const pet = pickRandom(['dog', 'cat', 'rabbit', 'horse']);
        const livestock = pickRandom(['pig', 'cow', 'chicken', 'sheep']);
        const petNum = pickRandomNumber([1, 1, 1, 2]);
        const livestockNum = pickRandomNumber([1, 2, 5, 10, 20]);
        
        return {
            category: 'animal-comparison',
            framing: 'Animal Comparison',
            question: `You can only save one group. Which do you save?`,
            optionA: {
                text: `Save ${petNum} ${getDisplay(pet, petNum)}`,
                entity: pet,
                num: petNum,
                categories: entities[pet].categories
            },
            optionB: {
                text: `Save ${livestockNum} ${getDisplay(livestock, livestockNum)}`,
                entity: livestock,
                num: livestockNum,
                categories: entities[livestock].categories
            }
        };
    },

    // Cosmetic testing
    function cosmeticTesting() {
        const animal = pickRandom(['rabbit', 'mouse', 'rat', 'monkey']);
        const animalNum = pickRandomNumber([10, 50, 100, 500]);
        const probability = pickRandomNumber([1, 2, 5, 10]);
        const humanNum = pickRandomNumber([1000, 5000, 10000, 100000]);
        
        return {
            category: 'testing-ethics',
            framing: 'Product Testing',
            question: `A new cosmetic product requires testing on ${animalNum} ${getDisplay(animal, animalNum)}. Without testing, there's a ${probability}% chance of allergic reactions affecting some of ${humanNum.toLocaleString()} potential users. Should the testing proceed?`,
            optionA: {
                text: `Yes, test on ${animalNum} ${getDisplay(animal, animalNum)}`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            },
            optionB: {
                text: `No, release untested (risk to humans)`,
                entity: 'human',
                num: Math.round(humanNum * probability / 100),
                categories: entities.human.categories
            }
        };
    },

    // Vaccine development
    function vaccineDevelopment() {
        const animal = pickRandom(['mouse', 'rat', 'monkey', 'pig']);
        const animalNum = pickRandomNumber([100, 500, 1000, 5000]);
        const human = pickRandom(allHumans);
        const humansSaved = pickRandomNumber([10000, 50000, 100000, 1000000]);
        const yearsDelay = pickRandomNumber([2, 3, 5, 10]);
        
        return {
            category: 'medical-research',
            framing: 'Vaccine Ethics',
            question: `A vaccine that could save ${humansSaved.toLocaleString()} ${getDisplay(human, humansSaved)} per year requires testing on ${animalNum.toLocaleString()} ${getDisplay(animal, animalNum)}. Alternative methods would delay the vaccine by ${yearsDelay} years. Should animal testing proceed?`,
            optionA: {
                text: `Yes, test on animals (vaccine available sooner)`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            },
            optionB: {
                text: `No, use alternatives (${yearsDelay}-year delay)`,
                entity: human,
                num: humansSaved * yearsDelay,
                categories: entities[human].categories
            }
        };
    },

    // Endangered species vs human development
    function endangeredVsDevelopment() {
        const animal = pickRandom(['gorilla', 'orangutan', 'elephant', 'whale', 'chimpanzee']);
        const animalNum = pickRandomNumber([50, 100, 200, 500]);
        const human = pickRandom(allHumans);
        const humanNum = pickRandomNumber([1000, 5000, 10000]);
        const percentSpecies = pickRandomNumber([5, 10, 20, 30]);
        
        return {
            category: 'conservation',
            framing: 'Species Preservation',
            question: `A development project would benefit ${humanNum.toLocaleString()} ${getDisplay(human, humanNum)} but would kill ${animalNum} ${getDisplay(animal, animalNum)} (approximately ${percentSpecies}% of the remaining wild population). Should the project proceed?`,
            optionA: {
                text: `Yes, proceed with development`,
                entity: human,
                num: humanNum,
                categories: entities[human].categories
            },
            optionB: {
                text: `No, protect the endangered ${getDisplay(animal, animalNum)}`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            }
        };
    },

    // Human life stages comparison
    function humanLifeStages() {
        const younger = pickRandom(['child', 'adult']);
        const older = younger === 'child' ? pickRandom(['adult', 'elderly']) : 'elderly';
        const youngerNum = pickRandomNumber([1, 1, 2]);
        const olderNum = pickRandomNumber([1, 2, 3, 5]);
        
        return {
            category: 'human-comparison',
            framing: 'Life Stage Comparison',
            question: 'You can only save one group. Which do you save?',
            optionA: {
                text: `Save ${youngerNum} ${getDisplay(younger, youngerNum)}`,
                entity: younger,
                num: youngerNum,
                categories: entities[younger].categories
            },
            optionB: {
                text: `Save ${olderNum} ${getDisplay(older, olderNum)}`,
                entity: older,
                num: olderNum,
                categories: entities[older].categories
            }
        };
    },

    // Rescue scenario
    function rescueScenario() {
        const usePalestinian = Math.random() < 0.15;
        let entityA = usePalestinian ? 'palestinian' : pickRandom(humanEntities);
        let entityB = pickRandom(animalEntities);
        
        const location = pickRandom(['a burning building', 'a sinking boat', 'a collapsed mine', 'floodwaters']);
        const numA = pickRandomNumber([1, 1, 2]);
        const numB = pickRandomNumber([1, 2, 5, 10]);
        
        return {
            category: 'rescue',
            framing: 'Rescue Scenario',
            question: `${numA} ${getDisplay(entityA, numA)} and ${numB} ${getDisplay(entityB, numB)} are trapped in ${location}. You can only rescue one group. Which do you save?`,
            optionA: {
                text: `Rescue ${numA} ${getDisplay(entityA, numA)}`,
                entity: entityA,
                num: numA,
                categories: entities[entityA].categories
            },
            optionB: {
                text: `Rescue ${numB} ${getDisplay(entityB, numB)}`,
                entity: entityB,
                num: numB,
                categories: entities[entityB].categories
            }
        };
    },

    // Resource allocation
    function resourceAllocation() {
        const usePalestinian = Math.random() < 0.15;
        let human = usePalestinian ? 'palestinian' : pickRandom(humanEntities);
        let animal = pickRandom(animalEntities);
        
        const humanNum = pickRandomNumber([100, 500, 1000, 5000]);
        const animalNum = pickRandomNumber([100, 500, 1000, 5000]);
        const resource = pickRandom(['medical supplies', 'food aid', 'clean water', 'shelter']);
        
        return {
            category: 'resource-allocation',
            framing: 'Resource Allocation',
            question: `Limited ${resource} can help either ${humanNum.toLocaleString()} ${getDisplay(human, humanNum)} or ${animalNum.toLocaleString()} ${getDisplay(animal, animalNum)} affected by a disaster. How should it be allocated?`,
            optionA: {
                text: `Prioritise the ${getDisplay(human, humanNum)}`,
                entity: human,
                num: humanNum,
                categories: entities[human].categories
            },
            optionB: {
                text: `Prioritise the ${getDisplay(animal, animalNum)}`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            }
        };
    },

    // Xenotransplantation
    function xenotransplantation() {
        const animal = pickRandom(['pig', 'monkey', 'chimpanzee']);
        const human = pickRandom(allHumans);
        const animalNum = pickRandomNumber([1, 1, 1, 5, 10]);
        const humanNum = pickRandomNumber([1, 1, 1, 2, 3]);
        const organ = pickRandom(['heart', 'kidney', 'liver']);
        
        return {
            category: 'organ-transplant',
            framing: 'Xenotransplantation',
            question: `${humanNum} ${getDisplay(human, humanNum)} need ${organ} transplants to survive. Genetically modified ${getDisplay(animal, animalNum)} could provide compatible organs, but ${animalNum} ${getDisplay(animal, animalNum)} would need to be killed. Is this acceptable?`,
            optionA: {
                text: `Yes, use the ${getDisplay(animal, animalNum)} organs`,
                entity: human,
                num: humanNum,
                categories: entities[human].categories
            },
            optionB: {
                text: `No, do not kill the ${getDisplay(animal, animalNum)}`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            }
        };
    },

    // Pest control
    function pestControl() {
        const pest = pickRandom(['rat', 'mouse', 'insect']);
        const human = pickRandom(allHumans);
        const pestNum = pickRandomNumber([100, 500, 1000, 5000]);
        const humanNum = pickRandomNumber([10, 50, 100, 500]);
        const disease = pickRandom(['disease', 'crop destruction', 'property damage']);
        
        return {
            category: 'pest-control',
            framing: 'Pest Control',
            question: `An infestation of ${getDisplay(pest, pestNum)} is causing ${disease} affecting ${humanNum} ${getDisplay(human, humanNum)}. Exterminating the ${getDisplay(pest, pestNum)} would solve the problem. Is this acceptable?`,
            optionA: {
                text: `Yes, exterminate the ${getDisplay(pest, pestNum)}`,
                entity: human,
                num: humanNum,
                categories: entities[human].categories
            },
            optionB: {
                text: `No, use humane relocation (less effective)`,
                entity: pest,
                num: pestNum,
                categories: entities[pest].categories
            }
        };
    },

    // Hunting for population control
    function huntingControl() {
        const animal = pickRandom(['deer', 'bear', 'wolf', 'elephant']);
        const animalNum = pickRandomNumber([50, 100, 200, 500]);
        const ecosystemBenefit = pickRandom(['prevent overgrazing', 'protect endangered species', 'reduce human-wildlife conflict', 'maintain ecosystem balance']);
        
        return {
            category: 'conservation',
            framing: 'Population Control',
            question: `Culling ${animalNum} ${getDisplay(animal, animalNum)} would ${ecosystemBenefit}. Without intervention, the population will cause ecological damage. Is culling acceptable?`,
            optionA: {
                text: `Yes, cull ${animalNum} ${getDisplay(animal, animalNum)}`,
                entity: animal,
                num: animalNum,
                categories: entities[animal].categories
            },
            optionB: {
                text: `No, let nature take its course`,
                entity: animal,
                num: Math.round(animalNum * 0.5),
                categories: entities[animal].categories
            }
        };
    },

    // Lab animal comparison
    function labAnimalComparison() {
        const animalA = pickRandom(['mouse', 'rat', 'rabbit']);
        const animalB = pickRandom(['monkey', 'chimpanzee', 'dog', 'pig']);
        const numA = pickRandomNumber([100, 500, 1000]);
        const numB = pickRandomNumber([1, 2, 5, 10]);
        
        return {
            category: 'testing-ethics',
            framing: 'Testing Method Choice',
            question: `Research can be conducted using either ${numA} ${getDisplay(animalA, numA)} or ${numB} ${getDisplay(animalB, numB)}. Both methods are equally effective. Which would you prefer?`,
            optionA: {
                text: `Use ${numA} ${getDisplay(animalA, numA)}`,
                entity: animalA,
                num: numA,
                categories: entities[animalA].categories
            },
            optionB: {
                text: `Use ${numB} ${getDisplay(animalB, numB)}`,
                entity: animalB,
                num: numB,
                categories: entities[animalB].categories
            }
        };
    },

    // Intelligent animal comparison
    function intelligentAnimalComparison() {
        const smartAnimals = ['chimpanzee', 'gorilla', 'dolphin', 'elephant', 'octopus', 'pig'];
        const animalA = pickRandom(smartAnimals);
        const animalB = pickRandom(smartAnimals.filter(a => a !== animalA));
        const numA = pickRandomNumber([1, 1, 2, 5]);
        const numB = pickRandomNumber([1, 2, 5, 10]);
        
        return {
            category: 'animal-comparison',
            framing: 'Intelligent Animal Comparison',
            question: `You can only save one group. Which do you save?`,
            optionA: {
                text: `Save ${numA} ${getDisplay(animalA, numA)}`,
                entity: animalA,
                num: numA,
                categories: entities[animalA].categories
            },
            optionB: {
                text: `Save ${numB} ${getDisplay(animalB, numB)}`,
                entity: animalB,
                num: numB,
                categories: entities[animalB].categories
            }
        };
    }
];

// Generate next scenario
function generateNextScenario(questionCount) {
    const generator = pickRandom(scenarioGenerators);
    const scenario = generator();
    scenario.id = `q${questionCount}_${Date.now()}`;
    return scenario;
}