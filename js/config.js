/* ============================================
   MORAL WEIGHTS EXPLORER - CONFIGURATION
   ============================================ */

// Supabase Configuration
const CONFIG = {
    SUPABASE_URL: 'https://nxmdvyngyrkqykbsligr.supabase.co',
    SUPABASE_KEY: 'sb_publishable_OVcVdS_I6F0ODbP6b1IzrQ_xe9vx6fJ',
    SESSION_SUBMIT_INTERVAL: 10 // Submit session every N questions
};

// ============================================
// ENTITY DEFINITIONS
// ============================================

const entities = {
    // Humans - General
    human: { 
        name: 'human', 
        display: 'human',
        displayPlural: 'humans',
        categories: ['person', 'human', 'sentient'],
        isHuman: true
    },
    child: { 
        name: 'child', 
        display: 'child',
        displayPlural: 'children',
        categories: ['person', 'human', 'sentient', 'vulnerable', 'young'],
        isHuman: true
    },
    adult: { 
        name: 'adult', 
        display: 'adult',
        displayPlural: 'adults',
        categories: ['person', 'human', 'sentient'],
        isHuman: true
    },
    elderly: { 
        name: 'elderly', 
        display: 'elderly person',
        displayPlural: 'elderly people',
        categories: ['person', 'human', 'sentient', 'vulnerable'],
        isHuman: true
    },
    parent: { 
        name: 'parent', 
        display: 'parent',
        displayPlural: 'parents',
        categories: ['person', 'human', 'sentient', 'caregiver'],
        isHuman: true
    },
    pregnant: { 
        name: 'pregnant', 
        display: 'pregnant person',
        displayPlural: 'pregnant people',
        categories: ['person', 'human', 'sentient', 'vulnerable'],
        isHuman: true
    },
    
    // Humans - Specific group (Palestinian only)
    palestinian: { 
        name: 'palestinian', 
        display: 'Palestinian',
        displayPlural: 'Palestinians',
        categories: ['person', 'human', 'sentient'],
        isHuman: true,
        isSpecificGroup: true
    },

    // Animals - Great Apes
    chimpanzee: { 
        name: 'chimpanzee', 
        display: 'chimpanzee',
        displayPlural: 'chimpanzees',
        categories: ['animal', 'mammal', 'primate', 'great-ape', 'sentient', 'wild', 'intelligent'],
        isHuman: false
    },
    gorilla: { 
        name: 'gorilla', 
        display: 'gorilla',
        displayPlural: 'gorillas',
        categories: ['animal', 'mammal', 'primate', 'great-ape', 'sentient', 'wild', 'intelligent'],
        isHuman: false
    },
    orangutan: { 
        name: 'orangutan', 
        display: 'orangutan',
        displayPlural: 'orangutans',
        categories: ['animal', 'mammal', 'primate', 'great-ape', 'sentient', 'wild', 'intelligent'],
        isHuman: false
    },
    
    // Animals - Other Primates
    monkey: { 
        name: 'monkey', 
        display: 'monkey',
        displayPlural: 'monkeys',
        categories: ['animal', 'mammal', 'primate', 'sentient', 'lab-animal'],
        isHuman: false
    },
    
    // Animals - Marine Mammals
    dolphin: { 
        name: 'dolphin', 
        display: 'dolphin',
        displayPlural: 'dolphins',
        categories: ['animal', 'mammal', 'marine', 'sentient', 'wild', 'intelligent'],
        isHuman: false
    },
    whale: { 
        name: 'whale', 
        display: 'whale',
        displayPlural: 'whales',
        categories: ['animal', 'mammal', 'marine', 'sentient', 'wild', 'intelligent'],
        isHuman: false
    },
    
    // Animals - Large Land Mammals
    elephant: { 
        name: 'elephant', 
        display: 'elephant',
        displayPlural: 'elephants',
        categories: ['animal', 'mammal', 'sentient', 'wild', 'intelligent'],
        isHuman: false
    },
    
    // Animals - Pets
    dog: { 
        name: 'dog', 
        display: 'dog',
        displayPlural: 'dogs',
        categories: ['animal', 'mammal', 'pet', 'sentient', 'domestic', 'companion'],
        isHuman: false
    },
    cat: { 
        name: 'cat', 
        display: 'cat',
        displayPlural: 'cats',
        categories: ['animal', 'mammal', 'pet', 'sentient', 'domestic', 'companion'],
        isHuman: false
    },
    
    // Animals - Farm Animals
    pig: { 
        name: 'pig', 
        display: 'pig',
        displayPlural: 'pigs',
        categories: ['animal', 'mammal', 'farm', 'sentient', 'livestock', 'intelligent'],
        isHuman: false
    },
    cow: { 
        name: 'cow', 
        display: 'cow',
        displayPlural: 'cows',
        categories: ['animal', 'mammal', 'farm', 'sentient', 'livestock'],
        isHuman: false
    },
    sheep: { 
        name: 'sheep', 
        display: 'sheep',
        displayPlural: 'sheep',
        categories: ['animal', 'mammal', 'farm', 'sentient', 'livestock'],
        isHuman: false
    },
    chicken: { 
        name: 'chicken', 
        display: 'chicken',
        displayPlural: 'chickens',
        categories: ['animal', 'bird', 'farm', 'sentient', 'livestock'],
        isHuman: false
    },
    
    // Animals - Lab Animals
    mouse: { 
        name: 'mouse', 
        display: 'mouse',
        displayPlural: 'mice',
        categories: ['animal', 'mammal', 'rodent', 'sentient', 'lab-animal'],
        isHuman: false
    },
    rat: { 
        name: 'rat', 
        display: 'rat',
        displayPlural: 'rats',
        categories: ['animal', 'mammal', 'rodent', 'sentient', 'lab-animal'],
        isHuman: false
    },
    rabbit: { 
        name: 'rabbit', 
        display: 'rabbit',
        displayPlural: 'rabbits',
        categories: ['animal', 'mammal', 'sentient', 'lab-animal', 'pet'],
        isHuman: false
    },
    
    // Animals - Other
    fish: { 
        name: 'fish', 
        display: 'fish',
        displayPlural: 'fish',
        categories: ['animal', 'aquatic', 'vertebrate'],
        isHuman: false
    },
    insect: { 
        name: 'insect', 
        display: 'insect',
        displayPlural: 'insects',
        categories: ['animal', 'invertebrate'],
        isHuman: false
    },
    octopus: { 
        name: 'octopus', 
        display: 'octopus',
        displayPlural: 'octopuses',
        categories: ['animal', 'invertebrate', 'marine', 'sentient', 'intelligent'],
        isHuman: false
    },
    horse: { 
        name: 'horse', 
        display: 'horse',
        displayPlural: 'horses',
        categories: ['animal', 'mammal', 'domestic', 'sentient', 'companion'],
        isHuman: false
    },
    deer: { 
        name: 'deer', 
        display: 'deer',
        displayPlural: 'deer',
        categories: ['animal', 'mammal', 'wild', 'sentient'],
        isHuman: false
    },
    bear: { 
        name: 'bear', 
        display: 'bear',
        displayPlural: 'bears',
        categories: ['animal', 'mammal', 'wild', 'sentient', 'intelligent'],
        isHuman: false
    },
    wolf: { 
        name: 'wolf', 
        display: 'wolf',
        displayPlural: 'wolves',
        categories: ['animal', 'mammal', 'wild', 'sentient', 'intelligent'],
        isHuman: false
    }
};

// ============================================
// ENTITY LISTS (computed from entities)
// ============================================

const humanEntities = Object.keys(entities).filter(e => entities[e].isHuman && !entities[e].isSpecificGroup);
const specificGroupEntities = Object.keys(entities).filter(e => entities[e].isSpecificGroup);
const animalEntities = Object.keys(entities).filter(e => !entities[e].isHuman);
const allHumans = Object.keys(entities).filter(e => entities[e].isHuman);

// ============================================
// HELPER FUNCTIONS
// ============================================

function getDisplay(entity, num) {
    const e = entities[entity];
    if (!e) return entity;
    return num === 1 ? e.display : e.displayPlural;
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomNumber(options) {
    return pickRandom(options);
}