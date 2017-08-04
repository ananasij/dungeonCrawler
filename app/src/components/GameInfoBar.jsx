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
            <div className="info-group">
                <span className="info-item info-item-s">
                    Current enemy:
                </span>
                <span className="info-item info-item-s">
                    Health: {gameInfo.currentEnemy.health}
                </span>
                <span className="info-item info-item-s">
                    Damage: {gameInfo.currentEnemy.damage}
                </span>
            </div>
        );
    }
    return (
        <div>
            <div className="info-row">
                <span className="info-item info-item-s">
                    Health: {hero.health}
                </span>
                <span className="info-item info-item-s">
                    Level: {hero.level}
                </span>
                <span className="info-item info-item-s">
                    XP: {hero.xp}
                </span>
                <span className="info-item info-item-l">
                    XP to next level: {hero.xpToNextLevel}
                </span>
            </div>
            <div className="info-row">
                <span className="info-item info-item-l">
                    Enemies left: {gameInfo.enemiesLeft}
                </span>
                {currentEnemyInfo}
            </div>
            <div>
                <button className="btn" onClick={onVisibilitySwitch}>
                    Toggle visibility
                </button>
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
