// 音效管理器
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicGain = null;
        this.sfxGain = null;
        this.masterVolume = 0.3;
        this.musicVolume = 0.2;
        this.sfxVolume = 0.4;
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 创建音量控制节点
            this.masterGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            
            // 连接音频节点
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);
            
            // 设置音量
            this.masterGain.gain.value = this.masterVolume;
            this.musicGain.gain.value = this.musicVolume;
            this.sfxGain.gain.value = this.sfxVolume;
            
        } catch (error) {
            console.warn('音频上下文初始化失败:', error);
        }
    }

    // 恢复音频上下文（用户交互后）
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // 创建射击音效
    playShoot(type = 'player') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        if (type === 'player') {
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        } else {
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.15);
        }
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.type = 'square';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // 创建爆炸音效
    playExplosion(size = 'small') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        const duration = size === 'big' ? 0.5 : 0.3;
        const startFreq = size === 'big' ? 200 : 150;
        
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + duration);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.type = 'sawtooth';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // 创建道具收集音效
    playPowerUp() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // 创建受伤音效
    playHit() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.type = 'sawtooth';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // 创建关卡完成音效
    playLevelComplete() {
        if (!this.audioContext) return;
        
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);
            
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.2);
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime + index * 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.2 + 0.3);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime + index * 0.2);
            oscillator.stop(this.audioContext.currentTime + index * 0.2 + 0.3);
        });
    }

    // 创建游戏结束音效
    playGameOver() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 1.0);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
        
        oscillator.type = 'triangle';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1.0);
    }

    // 播放背景音乐（简单的循环音调）
    playBackgroundMusic() {
        if (!this.audioContext || this.backgroundMusic) return;
        
        this.backgroundMusic = true;
        this.playMusicLoop();
    }

    playMusicLoop() {
        if (!this.audioContext || !this.backgroundMusic) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        // 简单的音乐循环
        const notes = [220, 246.94, 261.63, 293.66]; // A3, B3, C4, D4
        const noteIndex = Math.floor(Math.random() * notes.length);
        
        oscillator.frequency.setValueAtTime(notes[noteIndex], this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);
        
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 2.0);
        
        // 继续循环
        setTimeout(() => this.playMusicLoop(), 1500);
    }

    stopBackgroundMusic() {
        this.backgroundMusic = false;
    }
}

// 像素飞机游戏主逻辑
class PixelAircraft {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.currentLevel = 1;
        this.score = 0;
        this.gameSpeed = 1;
        
        // 游戏对象
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        
        // 游戏设置
        this.keys = {};
        this.mousePos = { x: 0, y: 0 };
        this.touchPos = { x: 0, y: 0 };
        this.isTouching = false;
        
        // 关卡进度
        this.levelProgress = 0;
        this.levelDuration = 60000; // 60秒
        this.enemySpawnTimer = 0;
        this.bossSpawned = false;
        
        // 游戏数据 - 每次重新打开游戏都从第一关开始
        this.level1Completed = false;
        // 清除之前的进度记录
        localStorage.removeItem('level1Completed');
        
        // 暂停状态
        this.isPaused = false;
        
        // 音效管理器
        this.soundManager = new SoundManager();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
        
        // 确保第二关按钮始终禁用（每次重新打开游戏都从第一关开始）
        const level2Btn = document.getElementById('level2Btn');
        if (level2Btn) {
            level2Btn.disabled = true;
        }
    }
    
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // 鼠标事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            this.mousePos.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        });
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isTouching = true;
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.touchPos.x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            this.touchPos.y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isTouching) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.touchPos.x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
                this.touchPos.y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isTouching = false;
        });
    }
    
    startGame(level) {
        console.log('PixelAircraft.startGame called with level:', level);
        
        this.currentLevel = level;
        this.gameState = 'playing';
        this.score = 0;
        this.levelProgress = 0;
        this.bossSpawned = false;
        
        // 清空所有游戏对象
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        
        // 创建玩家
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 80, this.soundManager);
        
        // 隐藏菜单
        const menuElement = document.getElementById('menu');
        const gameOverElement = document.getElementById('gameOver');
        
        console.log('Menu element found:', menuElement);
        console.log('GameOver element found:', gameOverElement);
        
        if (menuElement) {
            console.log('Menu classes before:', menuElement.className);
            menuElement.classList.add('hidden');
            console.log('Menu classes after:', menuElement.className);
        } else {
            console.error('Menu element not found!');
        }
        
        if (gameOverElement) {
            gameOverElement.classList.add('hidden');
        }
        
        // 显示暂停按钮
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.classList.remove('hidden');
        }
        
        // 显示UI元素
        const uiDiv = document.getElementById('ui');
        if (uiDiv) {
            uiDiv.classList.remove('hidden');
        }
        
        // 启动音效系统
        this.soundManager.resumeContext();
        this.soundManager.playBackgroundMusic();
        
        this.updateUI();
        console.log('startGame completed');
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.gameState !== 'playing' || this.isPaused) return;
        
        // 更新玩家
        if (this.player) {
            this.updatePlayerMovement();
            this.player.update();
            
            // 自动射击
            if (this.player.canShoot()) {
                this.player.shoot(this.bullets);
            }
        }
        
        // 更新子弹
        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return bullet.y > -10;
        });
        
        // 更新敌机子弹
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.update();
            return bullet.y < this.canvas.height + 10;
        });
        
        // 更新敌机
        this.enemies.forEach(enemy => enemy.update());
        this.enemies = this.enemies.filter(enemy => enemy.health > 0 && enemy.y < this.canvas.height + 50);
        
        // 更新道具
        this.powerUps.forEach(powerUp => powerUp.update());
        this.powerUps = this.powerUps.filter(powerUp => powerUp.y < this.canvas.height + 20);
        
        // 更新粒子效果
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => particle.life > 0);
        
        // 生成敌机
        this.spawnEnemies();
        
        // 碰撞检测
        this.checkCollisions();
        
        // 更新关卡进度
        this.levelProgress += 16; // 假设60FPS
        
        // 检查关卡完成
        this.checkLevelCompletion();
        
        this.updateUI();
    }
    
    updatePlayerMovement() {
        if (!this.player) return;
        
        let targetX = this.player.x;
        let targetY = this.player.y;
        
        // 键盘控制
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            targetX -= this.player.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            targetX += this.player.speed;
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            targetY -= this.player.speed;
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            targetY += this.player.speed;
        }
        
        // 触摸控制
        if (this.isTouching) {
            targetX = this.touchPos.x;
            targetY = this.touchPos.y;
        }
        
        // 边界检测
        targetX = Math.max(this.player.width / 2, Math.min(this.canvas.width - this.player.width / 2, targetX));
        targetY = Math.max(this.player.height / 2, Math.min(this.canvas.height - this.player.height / 2, targetY));
        
        this.player.x = targetX;
        this.player.y = targetY;
    }
    
    spawnEnemies() {
        this.enemySpawnTimer += 16;
        
        let spawnRate = this.currentLevel === 1 ? 1000 : 500; // 第二关敌机生成更频繁
        
        if (this.enemySpawnTimer >= spawnRate) {
            this.enemySpawnTimer = 0;
            
            if (this.currentLevel === 1) {
                this.spawnLevel1Enemy();
            } else {
                this.spawnLevel2Enemy();
            }
        }
        
        // 生成BOSS
        if (!this.bossSpawned && this.levelProgress > this.levelDuration * 0.8) {
            this.spawnBoss();
            this.bossSpawned = true;
        }
    }
    
    spawnLevel1Enemy() {
        const types = ['basic', 'medium'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (this.canvas.width - 40) + 20;
        
        if (type === 'basic') {
            this.enemies.push(new BasicEnemy(x, -30));
        } else {
            this.enemies.push(new MediumEnemy(x, -30));
        }
    }
    
    spawnLevel2Enemy() {
        const types = ['fast', 'heavy', 'bomber'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (this.canvas.width - 40) + 20;
        
        if (type === 'fast') {
            this.enemies.push(new FastEnemy(x, -30));
        } else if (type === 'heavy') {
            this.enemies.push(new HeavyEnemy(x, -30));
        } else {
            this.enemies.push(new BomberEnemy(x, -30));
        }
    }
    
    spawnBoss() {
        const bossX = this.canvas.width / 2;
        if (this.currentLevel === 1) {
            this.enemies.push(new Boss1(bossX, -60));
        } else {
            this.enemies.push(new Boss2(bossX, -80));
        }
    }
    
    checkCollisions() {
        if (!this.player) return;
        
        // 玩家子弹 vs 敌机
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(bullet, enemy)) {
                    // 创建爆炸效果
                    this.createExplosion(enemy.x, enemy.y, '#ff6b6b');
                    
                    enemy.takeDamage(bullet.damage);
                    this.bullets.splice(bulletIndex, 1);
                    
                    if (enemy.health <= 0) {
                        // 播放爆炸音效
                        this.soundManager.playExplosion('small');
                        
                        this.score += enemy.score;
                        
                        // 掉落道具
                        if (Math.random() < enemy.dropRate) {
                            this.spawnPowerUp(enemy.x, enemy.y);
                        }
                        
                        this.enemies.splice(enemyIndex, 1);
                    }
                }
            });
        });
        
        // 敌机子弹 vs 玩家
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.isColliding(bullet, this.player)) {
                this.createExplosion(this.player.x, this.player.y, '#ffff00');
                this.player.takeDamage(bullet.damage);
                this.enemyBullets.splice(bulletIndex, 1);
                
                if (this.player.health <= 0) {
                    this.gameOver(false);
                }
            }
        });
        
        // 敌机 vs 玩家
        this.enemies.forEach(enemy => {
            if (this.isColliding(enemy, this.player)) {
                this.createExplosion(this.player.x, this.player.y, '#ffff00');
                this.player.takeDamage(20);
                enemy.takeDamage(enemy.health); // 敌机也会被摧毁
                
                if (this.player.health <= 0) {
                    this.gameOver(false);
                }
            }
        });
        
        // 玩家 vs 道具
        this.powerUps.forEach((powerUp, index) => {
            if (this.isColliding(powerUp, this.player)) {
                // 播放道具收集音效
                this.soundManager.playPowerUp();
                
                this.applyPowerUp(powerUp.type);
                this.powerUps.splice(index, 1);
                this.createExplosion(powerUp.x, powerUp.y, '#00ff00');
            }
        });
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }
    
    spawnPowerUp(x, y) {
        const types = ['doubleFire', 'tripleFire', 'laser', 'shield', 'health'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push(new PowerUp(x, y, type));
    }
    
    applyPowerUp(type) {
        switch (type) {
            case 'doubleFire':
                this.player.weaponType = 'double';
                break;
            case 'tripleFire':
                this.player.weaponType = 'triple';
                break;
            case 'laser':
                this.player.weaponType = 'laser';
                break;
            case 'shield':
                this.player.shield = 100;
                break;
            case 'health':
                this.player.health = Math.min(100, this.player.health + 30);
                break;
        }
    }
    
    checkLevelCompletion() {
        // 检查是否击败了所有敌机包括BOSS
        const hasBoss = this.enemies.some(enemy => enemy.isBoss);
        
        if (this.bossSpawned && !hasBoss && this.enemies.length === 0) {
            this.levelComplete();
        }
    }
    
    levelComplete() {
        // 播放关卡完成音效
        this.soundManager.playLevelComplete();
        
        if (this.currentLevel === 1) {
            this.level1Completed = true;
            localStorage.setItem('level1Completed', 'true');
            document.getElementById('level2Btn').disabled = false;
        }
        
        this.gameOver(true);
    }
    
    gameOver(victory) {
        this.gameState = 'gameOver';
        
        // 停止背景音乐
        this.soundManager.stopBackgroundMusic();
        
        // 播放游戏结束音效（仅在失败时）
        if (!victory) {
            this.soundManager.playGameOver();
        }
        
        // 隐藏暂停按钮
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.classList.add('hidden');
        }
        
        const gameOverDiv = document.getElementById('gameOver');
        const titleElement = document.getElementById('gameOverTitle');
        const textElement = document.getElementById('gameOverText');
        const scoreElement = document.getElementById('finalScore');
        
        // 获取按钮元素 - 使用ID直接选择
        const backToMenuBtn = document.getElementById('backToMenuBtn');
        const restartBtn = document.getElementById('restartBtn');
        const nextLevelBtn = document.getElementById('nextLevelBtn');
        
        console.log('gameOver called with victory:', victory);
        console.log('Found buttons:', { backToMenuBtn, restartBtn, nextLevelBtn });
        
        if (victory) {
            titleElement.textContent = '关卡完成！';
            titleElement.style.color = '#00ff00';
            if (this.currentLevel === 1) {
                textElement.textContent = '恭喜完成第一关！准备迎接更大的挑战！';
                // 隐藏返回主菜单和重新开始按钮，显示进入第二关按钮
                backToMenuBtn.classList.add('btn-hidden');
                restartBtn.classList.add('btn-hidden');
                nextLevelBtn.classList.remove('btn-hidden');
            } else {
                textElement.textContent = '恭喜完成所有关卡！你是真正的飞行员！';
                // 显示返回主菜单和重新开始按钮，隐藏进入第二关按钮
                backToMenuBtn.classList.remove('btn-hidden');
                restartBtn.classList.remove('btn-hidden');
                nextLevelBtn.classList.add('btn-hidden');
            }
        } else {
            titleElement.textContent = '游戏结束';
            titleElement.style.color = '#ff6b6b';
            textElement.textContent = '再接再厉，继续挑战！';
            
            // 游戏失败时重置进度，需要重新从第一关开始
            this.level1Completed = false;
            localStorage.removeItem('level1Completed');
            
            // 禁用第二关按钮
            const level2Btn = document.getElementById('level2Btn');
            if (level2Btn) {
                level2Btn.disabled = true;
            }
            
            // 显示返回主菜单和重新开始按钮，隐藏进入第二关按钮
            backToMenuBtn.classList.remove('btn-hidden');
            restartBtn.classList.remove('btn-hidden');
            nextLevelBtn.classList.add('btn-hidden');
        }
        
        scoreElement.textContent = this.score;
        gameOverDiv.classList.remove('hidden');
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星空背景
        this.drawStarfield();
        
        if (this.gameState === 'playing') {
            // 绘制游戏对象
            if (this.player) this.player.render(this.ctx);
            
            this.bullets.forEach(bullet => bullet.render(this.ctx));
            this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
            this.enemies.forEach(enemy => enemy.render(this.ctx));
            this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
            this.particles.forEach(particle => particle.render(this.ctx));
        }
    }
    
    drawStarfield() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73 + Date.now() * 0.01) % this.canvas.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    updateUI() {
        if (this.player) {
            const healthElement = document.getElementById('health');
            const weaponElement = document.getElementById('weapon');
            if (healthElement) healthElement.textContent = Math.max(0, this.player.health);
            if (weaponElement) weaponElement.textContent = this.getWeaponName(this.player.weaponType);
        }
        const scoreElement = document.getElementById('score');
        const levelElement = document.getElementById('level');
        if (scoreElement) scoreElement.textContent = this.score;
        if (levelElement) levelElement.textContent = this.currentLevel;
    }
    
    getWeaponName(type) {
        const names = {
            'single': '基础',
            'double': '双发',
            'triple': '三发',
            'laser': '激光'
        };
        return names[type] || '基础';
    }
}

// 玩家类
class Player {
    constructor(x, y, soundManager = null) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.shield = 0;
        this.weaponType = 'single';
        this.shootCooldown = 0;
        this.shootDelay = 150;
        this.soundManager = soundManager;
    }
    
    update() {
        if (this.shootCooldown > 0) {
            this.shootCooldown -= 16;
        }
        
        if (this.shield > 0) {
            this.shield -= 0.5;
        }
    }
    
    canShoot() {
        return this.shootCooldown <= 0;
    }
    
    shoot(bullets) {
        this.shootCooldown = this.shootDelay;
        
        // 播放射击音效
        if (this.soundManager) {
            this.soundManager.playShoot('player');
        }
        
        switch (this.weaponType) {
            case 'single':
                bullets.push(new Bullet(this.x, this.y - 10, 0, -8, 10, '#00ff00'));
                break;
            case 'double':
                bullets.push(new Bullet(this.x - 8, this.y - 10, 0, -8, 10, '#00ff00'));
                bullets.push(new Bullet(this.x + 8, this.y - 10, 0, -8, 10, '#00ff00'));
                break;
            case 'triple':
                bullets.push(new Bullet(this.x, this.y - 10, 0, -8, 15, '#00ff00'));
                bullets.push(new Bullet(this.x - 12, this.y - 5, 0, -8, 15, '#00ff00'));
                bullets.push(new Bullet(this.x + 12, this.y - 5, 0, -8, 15, '#00ff00'));
                break;
            case 'laser':
                bullets.push(new Bullet(this.x, this.y - 10, 0, -12, 25, '#ff00ff', 8, 20));
                break;
        }
    }
    
    takeDamage(damage) {
        // 播放受伤音效
        if (this.soundManager) {
            this.soundManager.playHit();
        }
        
        if (this.shield > 0) {
            this.shield -= damage;
            if (this.shield < 0) {
                this.health += this.shield;
                this.shield = 0;
            }
        } else {
            this.health -= damage;
        }
    }
    
    render(ctx) {
        // 绘制护盾
        if (this.shield > 0) {
            ctx.save();
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 8, 0, Math.PI * 2);
            ctx.stroke();
            
            // 内层护盾
            ctx.shadowBlur = 8;
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // 绘制飞机主体（霓虹青色）
        ctx.save();
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 飞机引擎发光效果
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(this.x - 3, this.y + 8, 6, 4);
        
        // 飞机武器系统（黄色发光）
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x - 2, this.y - 10, 4, 6);
        
        // 飞机翼部（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 10, this.y + 2, 20, 3);
        
        // 驾驶舱（绿色发光）
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - 1, this.y - 4, 2, 4);
        
        ctx.restore();
    }
}

// 子弹类
class Bullet {
    constructor(x, y, vx, vy, damage, color, width = 4, height = 8) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        this.height = height;
        this.damage = damage;
        this.color = color;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    render(ctx) {
        ctx.save();
        
        // 根据子弹颜色设置发光效果
        if (this.color === '#00ff00' || this.color === '#00ffff') {
            // 玩家子弹 - 青色/绿色发光
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
        } else if (this.color === '#ff0000' || this.color === '#ff6666') {
            // 敌人子弹 - 红色发光
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 6;
        } else {
            // 其他子弹 - 默认发光
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 5;
        }
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 添加内核高亮
        ctx.shadowBlur = 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - this.width / 4, this.y - this.height / 4, this.width / 2, this.height / 2);
        
        ctx.restore();
    }
}

// 基础敌机
class BasicEnemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 2;
        this.health = 10;
        this.maxHealth = 10;
        this.score = 10;
        this.dropRate = 0.3;
        this.shootCooldown = 0;
        this.isBoss = false;
    }
    
    update() {
        this.y += this.speed;
        this.shootCooldown -= 16;
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
    
    render(ctx) {
        ctx.save();
        
        // 敌机主体（红色发光）
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 敌机细节（橙色发光）
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(this.x - this.width / 4, this.y - this.height / 4, this.width / 2, this.height / 2);
        
        // 敌机核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
        
        ctx.restore();
        
        // 血量条（带发光效果）
        if (this.health < this.maxHealth) {
            ctx.save();
            
            // 背景血量条
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, this.width, 3);
            
            // 当前血量条
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, 
                        this.width * (this.health / this.maxHealth), 3);
            
            ctx.restore();
        }
    }
}

// 中型敌机
class MediumEnemy extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.width = 30;
        this.height = 25;
        this.speed = 1.5;
        this.health = 25;
        this.maxHealth = 25;
        this.score = 25;
        this.dropRate = 0.4;
    }
    
    render(ctx) {
        ctx.save();
        
        // 中型敌机主体（橙色发光）
        ctx.shadowColor = '#ff8c42';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ff8c42';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 装甲层（红色发光）
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - this.width / 3, this.y - this.height / 3, this.width / 1.5, this.height / 1.5);
        
        // 武器系统（黄色发光）
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x - 3, this.y - this.height / 2 - 2, 6, 4);
        
        // 核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
        
        ctx.restore();
        
        // 血量条（带发光效果）
        if (this.health < this.maxHealth) {
            ctx.save();
            
            // 背景血量条
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, this.width, 3);
            
            // 当前血量条
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, 
                        this.width * (this.health / this.maxHealth), 3);
            
            ctx.restore();
        }
    }
}

// 快速敌机（第二关）
class FastEnemy extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.speed = 4;
        this.health = 8;
        this.maxHealth = 8;
        this.score = 15;
        this.dropRate = 0.2;
    }
    
    update() {
        super.update();
        // 左右摆动
        this.x += Math.sin(this.y * 0.02) * 2;
    }
    
    render(ctx) {
        ctx.save();
        
        // 快速敌机主体（黄色发光）
        ctx.shadowColor = '#ffd93d';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffd93d';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 推进器（橙色发光）
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(this.x - 2, this.y + this.height / 2 - 2, 4, 6);
        
        // 速度条纹（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x - 6 + i * 4, this.y - 2, 2, 4);
        }
        
        // 核心（青色发光）
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
        
        ctx.restore();
        
        // 血量条（带发光效果）
        if (this.health < this.maxHealth) {
            ctx.save();
            
            // 背景血量条
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, this.width, 3);
            
            // 当前血量条
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, 
                        this.width * (this.health / this.maxHealth), 3);
            
            ctx.restore();
        }
    }
}

// 重装敌机（第二关）
class HeavyEnemy extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.width = 35;
        this.height = 30;
        this.speed = 1;
        this.health = 50;
        this.maxHealth = 50;
        this.score = 50;
        this.dropRate = 0.6;
    }
    
    render(ctx) {
        ctx.save();
        
        // 重装敌机主体（紫色发光）
        ctx.shadowColor = '#6c5ce7';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#6c5ce7';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 重装甲层（深紫色发光）
        ctx.shadowColor = '#4834d4';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#4834d4';
        ctx.fillRect(this.x - this.width / 2.5, this.y - this.height / 2.5, this.width / 1.25, this.height / 1.25);
        
        // 武器炮塔（红色发光）
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 4, this.y - this.height / 2 - 3, 8, 6);
        
        // 装甲细节（青色发光）
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x - this.width / 3, this.y - 2, this.width / 1.5, 4);
        
        // 核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 4, this.y - 4, 8, 8);
        
        ctx.restore();
        
        // 血量条（带发光效果）
        if (this.health < this.maxHealth) {
            ctx.save();
            
            // 背景血量条
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, this.width, 3);
            
            // 当前血量条
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, 
                        this.width * (this.health / this.maxHealth), 3);
            
            ctx.restore();
        }
    }
}

// 自爆敌机（第二关）
class BomberEnemy extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.speed = 3;
        this.health = 5;
        this.maxHealth = 5;
        this.score = 20;
        this.dropRate = 0.1;
        this.exploded = false;
    }
    
    takeDamage(damage) {
        super.takeDamage(damage);
        if (this.health <= 0 && !this.exploded) {
            this.explode();
        }
    }
    
    explode() {
        this.exploded = true;
        
        // 播放大爆炸音效
        if (game.soundManager) {
            game.soundManager.playExplosion('large');
        }
        
        // 创建爆炸伤害区域
        // 这里可以添加范围伤害逻辑
    }
    
    render(ctx) {
        ctx.save();
        
        if (this.exploded) {
            // 爆炸状态（红色强烈发光）
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 25;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
            // 自爆敌机主体（橙色发光）
            ctx.shadowColor = '#e17055';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#e17055';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            
            // 炸药装置（黄色发光）
            ctx.shadowColor = '#ffa500';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#ffa500';
            ctx.fillRect(this.x - this.width / 3, this.y - this.height / 3, this.width / 1.5, this.height / 1.5);
            
            // 引爆器（红色发光）
            ctx.shadowColor = '#ff4757';
            ctx.shadowBlur = 6;
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
        }
        
        // 危险闪烁效果（更强烈的警告）
        if (Math.floor(Date.now() / 150) % 2) {
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
            
            // 额外的警告光环
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // 血量条（带发光效果）
        if (this.health < this.maxHealth) {
            ctx.save();
            
            // 背景血量条
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, this.width, 3);
            
            // 当前血量条
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 8, 
                        this.width * (this.health / this.maxHealth), 3);
            
            ctx.restore();
        }
    }
}

// BOSS1
class Boss1 extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.width = 60;
        this.height = 40;
        this.speed = 0.5;
        this.health = 200;
        this.maxHealth = 200;
        this.score = 500;
        this.dropRate = 1.0;
        this.isBoss = true;
        this.shootPattern = 0;
    }
    
    update() {
        super.update();
        // BOSS移动模式
        this.x += Math.sin(this.y * 0.01) * 1;
        
        // 射击模式
        if (this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = 800;
        }
    }
    
    shoot() {
        // 播放敌人射击音效
        if (game.soundManager) {
            game.soundManager.playShoot('enemy');
        }
        
        // 简单的射击模式
        game.enemyBullets.push(new Bullet(this.x, this.y + 20, 0, 4, 15, '#ff0000'));
        game.enemyBullets.push(new Bullet(this.x - 20, this.y + 20, -1, 4, 15, '#ff0000'));
        game.enemyBullets.push(new Bullet(this.x + 20, this.y + 20, 1, 4, 15, '#ff0000'));
    }
    
    render(ctx) {
        ctx.save();
        
        // BOSS主体（深灰色强烈发光）
        ctx.shadowColor = '#2d3436';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // BOSS装甲外壳（红色发光）
        ctx.shadowColor = '#ff7675';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ff7675';
        ctx.fillRect(this.x - this.width / 2.2, this.y - this.height / 2.2, this.width / 1.1, this.height / 1.1);
        
        // BOSS核心武器系统（红色强烈发光）
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 12, this.y - 6, 24, 12);
        
        // BOSS能量核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 6, this.y - 6, 12, 12);
        
        // BOSS侧翼武器（橙色发光）
        ctx.shadowColor = '#ffa500';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffa500';
        ctx.fillRect(this.x - this.width / 2 + 5, this.y - 3, 8, 6);
        ctx.fillRect(this.x + this.width / 2 - 13, this.y - 3, 8, 6);
        
        // BOSS推进器（青色发光）
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x - 4, this.y + this.height / 2 - 8, 8, 6);
        
        ctx.restore();
        
        // BOSS血量条（加强版，带发光效果）
        ctx.save();
        
        // 血量条背景
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 12, this.width, 6);
        
        // 当前血量
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 12, 
                    this.width * (this.health / this.maxHealth), 6);
        
        // BOSS血量条边框（金色发光）
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 4;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.width / 2 - 1, this.y - this.height / 2 - 13, this.width + 2, 8);
        
        ctx.restore();
    }
}

// BOSS2
class Boss2 extends Boss1 {
    constructor(x, y) {
        super(x, y);
        this.width = 80;
        this.height = 60;
        this.health = 400;
        this.maxHealth = 400;
        this.score = 1000;
        this.phase = 1;
    }
    
    update() {
        super.update();
        
        // 根据血量改变阶段
        if (this.health < this.maxHealth * 0.5 && this.phase === 1) {
            this.phase = 2;
            this.shootDelay = 400;
        }
    }
    
    shoot() {
        // 播放敌人射击音效
        if (game.soundManager) {
            game.soundManager.playShoot('enemy');
        }
        
        if (this.phase === 1) {
            // 第一阶段：扇形射击
            for (let i = -2; i <= 2; i++) {
                game.enemyBullets.push(new Bullet(this.x, this.y + 30, i * 0.5, 4, 20, '#ff0000'));
            }
        } else {
            // 第二阶段：圆形弹幕
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const vx = Math.cos(angle) * 3;
                const vy = Math.sin(angle) * 3;
                game.enemyBullets.push(new Bullet(this.x, this.y, vx, vy, 25, '#ff00ff'));
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // 根据阶段选择颜色和发光强度
        const isPhase1 = this.phase === 1;
        const mainColor = isPhase1 ? '#2d3436' : '#74b9ff';
        const accentColor = isPhase1 ? '#ff7675' : '#fd79a8';
        const glowIntensity = isPhase1 ? 25 : 35;
        
        // 终极BOSS主体（强烈发光）
        ctx.shadowColor = mainColor;
        ctx.shadowBlur = glowIntensity;
        ctx.fillStyle = mainColor;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 终极BOSS装甲外壳（阶段性颜色发光）
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = glowIntensity - 5;
        ctx.fillStyle = accentColor;
        ctx.fillRect(this.x - this.width / 2.1, this.y - this.height / 2.1, this.width / 1.05, this.height / 1.05);
        
        // 终极BOSS核心武器系统（更大更强）
        ctx.shadowColor = isPhase1 ? '#ff0000' : '#e84393';
        ctx.shadowBlur = 18;
        ctx.fillStyle = isPhase1 ? '#ff0000' : '#e84393';
        ctx.fillRect(this.x - 18, this.y - 12, 36, 24);
        
        // 终极BOSS能量核心（脉动效果）
        const pulseSize = 4 + Math.sin(Date.now() / 200) * 2;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - pulseSize, this.y - pulseSize, pulseSize * 2, pulseSize * 2);
        
        // 终极BOSS多重武器系统
        ctx.shadowColor = isPhase1 ? '#ffa500' : '#00cec9';
        ctx.shadowBlur = 12;
        ctx.fillStyle = isPhase1 ? '#ffa500' : '#00cec9';
        // 主炮
        ctx.fillRect(this.x - this.width / 2 + 8, this.y - 5, 12, 10);
        ctx.fillRect(this.x + this.width / 2 - 20, this.y - 5, 12, 10);
        // 副炮
        ctx.fillRect(this.x - this.width / 3, this.y - 8, 8, 6);
        ctx.fillRect(this.x + this.width / 3 - 8, this.y - 8, 8, 6);
        
        // 终极BOSS推进器阵列（青色发光）
        ctx.shadowColor = isPhase1 ? '#00ffff' : '#a29bfe';
        ctx.shadowBlur = 10;
        ctx.fillStyle = isPhase1 ? '#00ffff' : '#a29bfe';
        ctx.fillRect(this.x - 8, this.y + this.height / 2 - 10, 16, 8);
        ctx.fillRect(this.x - 15, this.y + this.height / 2 - 6, 6, 4);
        ctx.fillRect(this.x + 9, this.y + this.height / 2 - 6, 6, 4);
        
        // 阶段2特殊效果
        if (!isPhase1) {
            // 能量护盾
            ctx.shadowColor = '#74b9ff';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = '#74b9ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // 终极BOSS血量条（超强版，带发光效果）
        ctx.save();
        
        // 血量条背景
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 15, this.width, 8);
        
        // 当前血量（根据阶段变色）
        const healthColor = this.health / this.maxHealth > 0.5 ? '#00ff00' : '#ffff00';
        ctx.shadowColor = healthColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = healthColor;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 15, 
                    this.width * (this.health / this.maxHealth), 8);
        
        // 终极BOSS血量条边框（彩虹发光）
        ctx.shadowColor = isPhase1 ? '#ffd700' : '#e17055';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = isPhase1 ? '#ffd700' : '#e17055';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - this.width / 2 - 2, this.y - this.height / 2 - 17, this.width + 4, 12);
        
        ctx.restore();
    }
}

// 道具类
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.type = type;
        this.speed = 2;
    }
    
    update() {
        this.y += this.speed;
    }
    
    render(ctx) {
        const colors = {
            'doubleFire': '#00ff00',
            'tripleFire': '#0099ff',
            'laser': '#ff00ff',
            'shield': '#00ffff',
            'health': '#ff6b6b'
        };
        
        ctx.save();
        
        // 道具旋转动画
        const rotation = (Date.now() / 1000) % (Math.PI * 2);
        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);
        
        // 道具主体（强烈发光）
        const color = colors[this.type] || '#ffffff';
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // 道具内核（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.width / 3, -this.height / 3, this.width / 1.5, this.height / 1.5);
        
        // 道具边框（金色发光）
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2 - 1, -this.height / 2 - 1, this.width + 2, this.height + 2);
        
        ctx.restore();
        
        // 道具图标（不旋转）
        ctx.save();
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const symbols = {
            'doubleFire': '2',
            'tripleFire': '3',
            'laser': 'L',
            'shield': 'S',
            'health': '+'
        };
        ctx.fillText(symbols[this.type] || '?', this.x, this.y);
        
        // 道具光环效果
        const pulseSize = 5 + Math.sin(Date.now() / 300) * 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2 + pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

// 粒子效果类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 30;
        this.maxLife = 30;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        
        ctx.globalAlpha = alpha;
        
        // 粒子发光效果
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 2;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        // 粒子核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = this.size;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - this.size / 4, this.y - this.size / 4, this.size / 2, this.size / 2);
        
        ctx.restore();
    }
}

// 全局函数
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