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

// 快速敌机
class FastEnemy extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.width = 16;
        this.height = 16;
        this.speed = 4;
        this.health = 5;
        this.maxHealth = 5;
        this.score = 15;
        this.dropRate = 0.2;
    }
    
    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * 0.02) * 2;
        this.shootCooldown -= 16;
    }
    
    render(ctx) {
        ctx.save();
        
        // 快速敌机主体（紫色发光）
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 推进器（蓝色发光）
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(this.x - this.width / 3, this.y + this.height / 3, this.width / 1.5, this.height / 3);
        
        // 核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
        
        // 速度线条效果
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - this.width / 2, this.y + this.height);
        ctx.lineTo(this.x - this.width / 2, this.y + this.height + 10);
        ctx.moveTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height + 10);
        ctx.stroke();
        
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

// 重型敌机
class HeavyEnemy extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.width = 40;
        this.height = 35;
        this.speed = 1;
        this.health = 50;
        this.maxHealth = 50;
        this.score = 50;
        this.dropRate = 0.6;
    }
    
    render(ctx) {
        ctx.save();
        
        // 重型敌机主体（深红色发光）
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 装甲层1（橙红色发光）
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(this.x - this.width / 2.5, this.y - this.height / 2.5, this.width / 1.25, this.height / 1.25);
        
        // 装甲层2（黄色发光）
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#eab308';
        ctx.fillRect(this.x - this.width / 3, this.y - this.height / 3, this.width / 1.5, this.height / 1.5);
        
        // 武器系统（红色发光）
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 4, this.y - this.height / 2 - 3, 8, 6);
        
        // 侧翼武器
        ctx.fillRect(this.x - this.width / 2 - 2, this.y - 2, 4, 4);
        ctx.fillRect(this.x + this.width / 2 - 2, this.y - 2, 4, 4);
        
        // 核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 4, this.y - 4, 8, 8);
        
        // 装甲细节线条
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 4;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - this.width / 3, this.y - this.height / 3);
        ctx.lineTo(this.x + this.width / 3, this.y - this.height / 3);
        ctx.moveTo(this.x - this.width / 3, this.y + this.height / 3);
        ctx.lineTo(this.x + this.width / 3, this.y + this.height / 3);
        ctx.stroke();
        
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

// 轰炸机敌机
class BomberEnemy extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.width = 35;
        this.height = 30;
        this.speed = 1.2;
        this.health = 30;
        this.maxHealth = 30;
        this.score = 40;
        this.dropRate = 0.5;
        this.exploded = false;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0 && !this.exploded) {
            this.explode();
        }
    }
    
    explode() {
        this.exploded = true;
        // 播放大爆炸音效
        if (game && game.soundManager) {
            game.soundManager.playExplosion('large');
        }
        
        // 创建爆炸效果
        for (let i = 0; i < 15; i++) {
            game.particles.push(new Particle(this.x, this.y, '#ff6b00'));
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // 轰炸机主体（深橙色发光）
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 炸弹舱（红色发光）
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(this.x - this.width / 3, this.y - this.height / 4, this.width / 1.5, this.height / 2);
        
        // 炸弹（黄色发光）
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#fbbf24';
        for (let i = -1; i <= 1; i++) {
            ctx.fillRect(this.x + i * 8 - 2, this.y + this.height / 4 - 2, 4, 4);
        }
        
        // 推进器（蓝色发光）
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(this.x - this.width / 4, this.y + this.height / 3, this.width / 2, this.height / 4);
        
        // 机翼（灰色发光）
        ctx.shadowColor = '#6b7280';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(this.x - this.width / 2 - 5, this.y - 2, this.width + 10, 4);
        
        // 核心（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
        
        // 危险标识（闪烁红色）
        if (Math.floor(Date.now() / 200) % 2) {
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - 1, this.y - this.height / 2 - 4, 2, 2);
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

// Boss1
class Boss1 extends BasicEnemy {
    constructor(x, y) {
        super(x, y);
        this.width = 80;
        this.height = 60;
        this.speed = 0.5;
        this.health = 200;
        this.maxHealth = 200;
        this.score = 500;
        this.dropRate = 1.0;
        this.isBoss = true;
        this.shootPattern = 0;
        this.movePattern = 0;
        this.moveTimer = 0;
    }
    
    update() {
        this.moveTimer += 16;
        
        // 移动模式
        switch (this.movePattern) {
            case 0:
                this.x += Math.sin(this.moveTimer * 0.002) * 2;
                break;
            case 1:
                this.y += this.speed;
                break;
        }
        
        this.shootCooldown -= 16;
    }
    
    shoot() {
        if (this.shootCooldown <= 0) {
            this.shootCooldown = 1000;
            
            // 播放敌人射击音效
            if (game && game.soundManager) {
                game.soundManager.playShoot('enemy');
            }
            
            // 多方向射击
            for (let i = -2; i <= 2; i++) {
                game.enemyBullets.push(new Bullet(
                    this.x + i * 15, this.y + this.height / 2, 
                    i * 2, 4, 15, '#ff0000'
                ));
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Boss主体（深红色发光）
        ctx.shadowColor = '#991b1b';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 装甲层（红色发光）
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(this.x - this.width / 2.5, this.y - this.height / 2.5, this.width / 1.25, this.height / 1.25);
        
        // 武器系统（橙色发光）
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ea580c';
        for (let i = -2; i <= 2; i++) {
            ctx.fillRect(this.x + i * 15 - 3, this.y + this.height / 2 - 5, 6, 10);
        }
        
        // 核心（黄色发光）
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(this.x - 8, this.y - 8, 16, 16);
        
        // 内核（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 4, this.y - 4, 8, 8);
        
        // 装甲细节
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(this.x - this.width / 3, this.y - this.height / 3, this.width / 1.5, this.height / 1.5);
        ctx.stroke();
        
        ctx.restore();
        
        // Boss血量条（更大更显眼）
        ctx.save();
        
        // 背景血量条
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 15, this.width, 6);
        
        // 当前血量条
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 15, 
                    this.width * (this.health / this.maxHealth), 6);
        
        // 血量文字
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.health}/${this.maxHealth}`, this.x, this.y - this.height / 2 - 20);
        
        ctx.restore();
    }
}

// Boss2
class Boss2 extends Boss1 {
    constructor(x, y) {
        super(x, y);
        this.width = 100;
        this.height = 80;
        this.health = 300;
        this.maxHealth = 300;
        this.score = 1000;
        this.laserCharging = false;
        this.laserCharge = 0;
    }
    
    update() {
        super.update();
        
        if (this.laserCharging) {
            this.laserCharge += 16;
            if (this.laserCharge >= 2000) {
                this.fireLaser();
                this.laserCharging = false;
                this.laserCharge = 0;
            }
        }
    }
    
    shoot() {
        if (this.shootCooldown <= 0) {
            this.shootCooldown = 800;
            
            // 播放敌人射击音效
            if (game && game.soundManager) {
                game.soundManager.playShoot('enemy');
            }
            
            if (Math.random() < 0.3) {
                this.laserCharging = true;
            } else {
                // 螺旋射击模式
                const time = Date.now() * 0.01;
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI / 4) + time;
                    const vx = Math.cos(angle) * 3;
                    const vy = Math.sin(angle) * 3 + 2;
                    game.enemyBullets.push(new Bullet(
                        this.x, this.y + this.height / 2, 
                        vx, vy, 20, '#ff4444'
                    ));
                }
            }
        }
    }
    
    fireLaser() {
        // 发射激光
        for (let i = 0; i < 5; i++) {
            game.enemyBullets.push(new Bullet(
                this.x, this.y + this.height / 2 + i * 10, 
                0, 8, 30, '#ff00ff', 12, 30
            ));
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // 终极Boss主体（深紫色发光）
        ctx.shadowColor = '#581c87';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#581c87';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 装甲层1（紫色发光）
        ctx.shadowColor = '#7c3aed';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(this.x - this.width / 2.5, this.y - this.height / 2.5, this.width / 1.25, this.height / 1.25);
        
        // 装甲层2（蓝紫色发光）
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(this.x - this.width / 3, this.y - this.height / 3, this.width / 1.5, this.height / 1.5);
        
        // 激光充能效果
        if (this.laserCharging) {
            const chargeProgress = this.laserCharge / 2000;
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 20 * chargeProgress;
            ctx.fillStyle = `rgba(255, 0, 255, ${chargeProgress})`;
            ctx.fillRect(this.x - 5, this.y + this.height / 2 - 10, 10, 20);
        }
        
        // 武器系统（红紫色发光）
        ctx.shadowColor = '#c026d3';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#c026d3';
        for (let i = -3; i <= 3; i++) {
            if (i !== 0) {
                ctx.fillRect(this.x + i * 12 - 2, this.y + this.height / 2 - 6, 4, 12);
            }
        }
        
        // 核心（金色发光）
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
        
        // 内核（白色发光）
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 6, this.y - 6, 12, 12);
        
        // 装甲细节和能量线条
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.rect(this.x - this.width / 3, this.y - this.height / 3, this.width / 1.5, this.height / 1.5);
        ctx.stroke();
        
        // 能量脉冲线条
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const offset = (Date.now() * 0.01 + i * Math.PI / 2) % (Math.PI * 2);
            const x1 = this.x + Math.cos(offset) * (this.width / 3);
            const y1 = this.y + Math.sin(offset) * (this.height / 3);
            const x2 = this.x + Math.cos(offset) * (this.width / 2);
            const y2 = this.y + Math.sin(offset) * (this.height / 2);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // 终极Boss血量条（最大最显眼）
        ctx.save();
        
        // 背景血量条
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 20, this.width, 8);
        
        // 当前血量条
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 20, 
                    this.width * (this.health / this.maxHealth), 8);
        
        // 血量文字
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`FINAL BOSS: ${this.health}/${this.maxHealth}`, this.x, this.y - this.height / 2 - 30);
        
        ctx.restore();
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BasicEnemy, MediumEnemy, FastEnemy, HeavyEnemy, BomberEnemy, Boss1, Boss2 };
}