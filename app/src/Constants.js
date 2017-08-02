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
        ENEMIESDENSITY: 0.004
    }
};

export default Constants;
