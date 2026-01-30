// XP and Level System Utilities

/**
 * Level thresholds - XP required for each level
 * Level 0: 0 XP (Starting level)
 * Level 1: 50 XP
 * Level 2: 150 XP
 * Level 3: 300 XP
 * etc. (exponential growth)
 */
export const LEVEL_THRESHOLDS = [
    0,      // Level 0
    50,     // Level 1
    150,    // Level 2
    300,    // Level 3
    500,    // Level 4
    750,    // Level 5
    1100,   // Level 6
    1500,   // Level 7
    2000,   // Level 8
    2750,   // Level 9
    3750,   // Level 10
    5000,   // Level 11
    6500,   // Level 12
    8500,   // Level 13
    11000,  // Level 14
    15000,  // Level 15 (Max for now)
];

/**
 * Bonus points awarded when reaching each level
 */
export const LEVEL_BONUS_POINTS = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    7: 35,
    8: 40,
    9: 45,
    10: 50,
    11: 60,
    12: 70,
    13: 80,
    14: 90,
    15: 100,
};

/**
 * Level names/titles
 */
export const LEVEL_TITLES = {
    0: 'Newbie',
    1: 'Pemula',
    2: 'Penjelajah',
    3: 'Pejuang Hijau',
    4: 'Pelindung Alam',
    5: 'Pahlawan Recycle',
    6: 'Master Hijau',
    7: 'Eco Warrior',
    8: 'Green Champion',
    9: 'Planet Defender',
    10: 'Eco Legend',
    11: 'Sustainability Guru',
    12: 'Earth Guardian',
    13: 'Climate Hero',
    14: 'Eco Master',
    15: 'Ultimate Recycler',
};

/**
 * Calculate level from XP (starting from 0)
 */
export function calculateLevel(xp) {
    let level = 0;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i;
            break;
        }
    }
    return Math.min(level, 15); // Max level is 15
}

/**
 * Get XP required for next level
 */
export function getXpForNextLevel(currentLevel) {
    if (currentLevel >= 15) return LEVEL_THRESHOLDS[15]; // Max level
    return LEVEL_THRESHOLDS[currentLevel + 1]; // Next level threshold
}

/**
 * Get current level's XP threshold
 */
export function getCurrentLevelXp(level) {
    return LEVEL_THRESHOLDS[level] || 0;
}

/**
 * Calculate XP progress percentage to next level
 */
export function calculateProgress(xp, level) {
    if (level >= 15) return 100; // Max level

    const currentLevelXp = getCurrentLevelXp(level);
    const nextLevelXp = getXpForNextLevel(level);
    const xpInCurrentLevel = xp - currentLevelXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelXp;

    if (xpNeededForNextLevel <= 0) return 100;
    return Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100));
}

/**
 * Get level title
 */
export function getLevelTitle(level) {
    return LEVEL_TITLES[level] || LEVEL_TITLES[0];
}

/**
 * Get bonus points for reaching a level
 */
export function getLevelBonusPoints(level) {
    return LEVEL_BONUS_POINTS[level] || 0;
}

/**
 * Calculate XP earned from weight (grams)
 * 1 gram = 1 XP
 */
export function calculateXpFromWeight(weightInGrams) {
    return Math.floor(weightInGrams);
}
