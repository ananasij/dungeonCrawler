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
        VISIBILITY_RADIUS: 6
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
        MIN_ROOM_SIDE: 5,
        MAX_ROOM_SIDE: 10,
        COVERAGE_INDEX: 0.3
    },
    ItemsDensity: {
        ENEMIES_DENSITY: 0.004,
        HEALTHPOINTS_DENSITY: 0.002
    },
    Hero: {
        H_INITIAL_HEALTH: 100
    },
    Enemy: {
        E_MIN_HEALTH: 5,
        E_HEALTH_DEVIATION: 25,
        E_MIN_DAMAGE: 10,
        E_DAMAGE_DEVIATION: 10
    },
    HealthPoints: {
        HP_MIN_HEALTH: 10,
        HP_HEALTH_DEVIATION: 10
    },
    Xp: {
        XP_MIN: 10,
        XP_PER_HIT: 10,
        LEVELUP_BASE: 50
    }
};

export default Constants;
