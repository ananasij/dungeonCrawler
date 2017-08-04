import React from 'react';
import PropTypes from 'prop-types';
import Constants from './../Constants';

const { EMPTY, DUNGEON, HERO, ENEMY, HEALTHPOINT } = Constants.CellState;

function getItemID(x, y) {
    return ''.concat(x).concat('-').concat(y);
}

function StatsBar({ hero, gameInfo, onVisibilitySwitch }) {
    let currentEnemyInfo = null;
    if (gameInfo.currentEnemy) {
        currentEnemyInfo = (
            <div>
                Current enemy: Health: {gameInfo.currentEnemy.health} Damage: {gameInfo.currentEnemy.damage}
            </div>
        );
    }
    return (
        <div>
            <div>
                Health: {hero.health}<br />
                Level: {hero.level}<br />
                XP to next level: {hero.xpToNextLevel}<br />
                XP: {hero.xp}
            </div>
            <div>
                Enemies left: {gameInfo.enemiesLeft}
            </div>
            <div>
                {currentEnemyInfo}
            </div>
            <div>
                <button onClick={onVisibilitySwitch}>Toggle visibility</button>
            </div>
        </div>
    );
}

StatsBar.propTypes = {
    hero: PropTypes.object.isRequired,
    gameInfo: PropTypes.object.isRequired,
    onVisibilitySwitch: PropTypes.func.isRequired
};

export default StatsBar;
