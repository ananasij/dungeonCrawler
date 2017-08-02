const Constants = {
    GameState: {
        GAME: 'GAME',
        WIN: 'WIN',
        LOSS: 'LOSS'
    },
    CellState: {
        EMPTY: 'EMPTY',
        DUNGEON: 'DUNGEON',
        HERO: 'HERO',
        ENEMY: 'ENEMY'
    },
    Map: {
        WIDTH: 50,
        HEIGHT: 60,
        MINROOMSIDE: 5,
        MAXROOMSIDE: 10,
        COVERAGEINDEX: 0.3
    },
    ItemsDensity: {
        ENEMIESDENSITY: 0.005
    },
    Hero: {
        H_INITIALHEALTH: 100
    },
    Enemy: {
        E_MINHEALTH: 5,
        E_HEALTHDEVIATION: 25,
        E_MINDAMAGE: 10,
        E_DAMAGEDEVIATION: 10
    },
    Xp: {
        XP_MIN: 10,
        XP_PER_HIT: 10,
        LEVELUP_BASE: 50
    }
};

export default Constants;
