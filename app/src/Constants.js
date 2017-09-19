const Constants = {
    GameState: {
        LOADING: 'LOADING',
        GAME: 'GAME',
        WIN: 'WIN',
        LOSS: 'LOSS'
    },
    Visibility: {
        FULL: 'FULL',
        LIMITED: 'LIMITED',
        VISIBILITYRADIUS: 6
    },
    CellState: {
        EMPTY: 'EMPTY',
        DUNGEON: 'DUNGEON',
        HERO: 'HERO',
        ENEMY: 'ENEMY',
        HEALTHPOINT: 'HEALTHPOINT'
    },
    Map: {
        CELL_SIZE_PX: 15,
        WIDTH: 50,
        HEIGHT: 60,
        MINROOMSIDE: 5,
        MAXROOMSIDE: 10,
        COVERAGEINDEX: 0.3
    },
    ItemsDensity: {
        ENEMIESDENSITY: 0.004,
        HEALTHPOINTSDENSITY: 0.002
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
    HealthPoints: {
        HP_MINHEALTH: 10,
        HP_HEALTHDEVIATION: 10
    },
    Xp: {
        XP_MIN: 10,
        XP_PER_HIT: 10,
        LEVELUP_BASE: 50
    }
};

export default Constants;
