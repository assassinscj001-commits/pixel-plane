// 主游戏类
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

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PixelAircraft;
}