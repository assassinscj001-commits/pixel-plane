// 游戏工具函数和初始化逻辑

let game;

function startGame(level) {
    console.log('startGame called with level:', level);
    if (game) {
        // 检查第二关权限
        if (level === 2 && !game.level1Completed) {
            alert('请先完成第一关才能挑战第二关！');
            return;
        }
        
        console.log('Game instance exists, calling startGame');
        game.startGame(level);
    } else {
        console.error('Game instance not found!');
    }
}

function showInstructions() {
    console.log('showInstructions called');
    
    // 隐藏主菜单
    const menuDiv = document.getElementById('menu');
    if (menuDiv) {
        menuDiv.classList.add('hidden');
    }
    
    // 隐藏UI元素
    const uiDiv = document.getElementById('ui');
    if (uiDiv) {
        uiDiv.classList.add('hidden');
    }
    
    // 显示游戏说明页面
    const instructionsDiv = document.getElementById('instructions');
    if (instructionsDiv) {
        instructionsDiv.classList.remove('hidden');
    }
}

function backToMenu() {
    console.log('backToMenu called');
    if (game) {
        game.gameState = 'menu';
        
        // 隐藏游戏结束界面
        const gameOverDiv = document.getElementById('gameOver');
        if (gameOverDiv) {
            gameOverDiv.classList.add('hidden');
            console.log('Game over screen hidden');
        }
        
        // 隐藏游戏说明页面
        const instructionsDiv = document.getElementById('instructions');
        if (instructionsDiv) {
            instructionsDiv.classList.add('hidden');
            console.log('Instructions screen hidden');
        }
        
        // 隐藏暂停按钮
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.classList.add('hidden');
        }
        
        // 显示主菜单
        const menuDiv = document.getElementById('menu');
        if (menuDiv) {
            menuDiv.classList.remove('hidden');
            // 移除任何内联样式，让CSS控制布局
            menuDiv.style.display = '';
            console.log('Menu shown and display reset');
        }
        
        // 显示UI元素（在主菜单时应该隐藏，但在游戏中需要显示）
        const uiDiv = document.getElementById('ui');
        if (uiDiv) {
            uiDiv.classList.add('hidden'); // 在主菜单时隐藏UI
        }
        
        // 重置按钮显示状态
        const backToMenuBtn = document.getElementById('backToMenuBtn');
        const restartBtn = document.getElementById('restartBtn');
        const nextLevelBtn = document.getElementById('nextLevelBtn');
        
        if (backToMenuBtn) {
            backToMenuBtn.classList.remove('btn-hidden');
            console.log('Reset backToMenu button display');
        }
        if (restartBtn) {
            restartBtn.classList.remove('btn-hidden');
            console.log('Reset restart button display');
        }
        if (nextLevelBtn) {
            nextLevelBtn.classList.add('btn-hidden');
            console.log('Reset nextLevel button display');
        }
    } else {
        console.error('Game instance not found in backToMenu!');
    }
}

function restartGame() {
    // 重新开始游戏时总是从第一关开始
    game.startGame(1);
}

// 暂停游戏
function pauseGame() {
    if (game && game.gameState === 'playing') {
        game.isPaused = true;
        document.getElementById('pauseMenu').classList.remove('hidden');
    }
}

// 继续游戏
function resumeGame() {
    if (game) {
        game.isPaused = false;
        document.getElementById('pauseMenu').classList.add('hidden');
    }
}

// 从暂停菜单重新开始当前关卡
function restartCurrentLevel() {
    if (game) {
        game.isPaused = false;
        document.getElementById('pauseMenu').classList.add('hidden');
        game.startGame(game.currentLevel);
    }
}

// 从暂停菜单返回主菜单
function backToMenuFromPause() {
    if (game) {
        game.isPaused = false;
        game.gameState = 'menu';
        
        // 隐藏暂停菜单和暂停按钮
        document.getElementById('pauseMenu').classList.add('hidden');
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.classList.add('hidden');
        }
        
        // 显示主菜单
        const menuDiv = document.getElementById('menu');
        if (menuDiv) {
            menuDiv.classList.remove('hidden');
        }
        
        // 隐藏游戏说明页面
        const instructionsDiv = document.getElementById('instructions');
        if (instructionsDiv) {
            instructionsDiv.classList.add('hidden');
        }
    }
}

// 确保DOM完全加载后初始化游戏
function initializeGame() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing game...');
            game = new PixelAircraft();
            console.log('Game initialized:', game);
        });
    } else {
        console.log('DOM already loaded, initializing game immediately...');
        game = new PixelAircraft();
        console.log('Game initialized:', game);
    }
}

// 初始化游戏
initializeGame();

// 备用初始化
window.addEventListener('load', () => {
    if (!game) {
        console.log('Backup initialization...');
        game = new PixelAircraft();
    }
});