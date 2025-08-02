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

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}