import React from 'react';
import ReactDOM from 'react-dom';
import {
  GAME_CONFIG
} from './common.js';
import { GameBoard } from './game-board.js';
import { BallManager } from './ball-manager.js';
import { BallManagerListener } from './ball-manager-listener.js';
import { ResetListener } from './reset-listener.js';
import { GameState } from './game-state.js';
import { GameEngine } from './game-engine.js';
import { ResetButton } from './reset-button';



class Line98 {
  constructor(namePrefix) {
    this.dimension = GAME_CONFIG.BOARD_DIMENSION;
    this.namePrefix = namePrefix;
  }

  defaultInitialize() {
    // Initializing should be done from boundary to controller then to entity
    this.initializeAnimationCsses();
    this.initializeGameBoard();
    this.initializeGameEngine();
    // ResetButton should be initialized finally sothat the engine is ready
    this.initializeResetButton();
    this.engine.resetGame();
  }

  initializeAnimationCsses() {
    let i = 0;
    let cssNode = document.createElement('STYLE');
    let entryPoint = document.getElementById(this.namePrefix + 'EntryPoint');
    let parentNode = entryPoint.parentNode;
    let cssStr = `
      @keyframes ballFocused {
        from {}
        to {margin-bottom: 15px}
      }
    `;
    cssNode.type = 'text/css';
    for (i = 0; i < GAME_CONFIG.COLOUR_LIST.length; i++) {
      cssStr += `
        @keyframes ballGenerating${i} {
          from {
            background: ${GAME_CONFIG.COLOUR_LIST[i]};
            width: 0px;
            height: 0px;
          }
          to {
            background: ${GAME_CONFIG.COLOUR_LIST[i]};
          }
        }
      `;
    }
    cssNode.innerHTML = cssStr;
    cssNode = parentNode.insertBefore(cssNode, entryPoint);
  }

  initializeGameBoard() {
    let dim = this.dimension.toString();
    this.ballManager = ReactDOM.render(
      <GameBoard cellSize="50" lineWidth="1" dimension={dim} />,
      document.getElementById(this.namePrefix + 'EntryPoint')
    );
    // Add BallManager interface implementation to GameBoard
    Object.assign(this.ballManager, BallManager);
  }

  initializeGameEngine() {
    let gameState = new GameState(this.dimension);
    let engine = new GameEngine(
      gameState,
      this.ballManager
    );
    // Add ResetListener interface implementation to GameEngine
    Object.assign(engine, ResetListener);
    // Add BallManagerListener interface implementation to GameEngine
    Object.assign(engine, BallManagerListener);
    this.ballManager.ballManagerListener = engine;
    this.engine = engine;
  }

  initializeResetButton() {
    let className = "resetButton";
    let resetButton = document.getElementById(this.namePrefix + 'ResetButton');
    if (resetButton !== null) {
      ReactDOM.render(
        <ResetButton className={className} resetListener={this.engine} />,
        resetButton
      );
    }
  }
}



new Line98("line98").defaultInitialize();
