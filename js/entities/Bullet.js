// 子弹类
class Bullet {
    constructor(x, y, vx, vy, damage, color = '#00ff00', width = 4, height = 10) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.color = color;
        this.width = width;
        this.height = height;
        this.active = true;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // 检查是否超出屏幕边界
        if (this.y < -this.height || this.y > 600 + this.height || 
            this.x < -this.width || this.x > 800 + this.width) {
            this.active = false;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // 添加内部高亮
        ctx.shadowBlur = 4;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(this.x - this.width / 4, this.y - this.height / 2, this.width / 2, this.height);
        
        ctx.restore();
    }
    
    // 碰撞检测
    collidesWith(other) {
        return this.x < other.x + other.width / 2 &&
               this.x + this.width / 2 > other.x - other.width / 2 &&
               this.y < other.y + other.height / 2 &&
               this.y + this.height / 2 > other.y - other.height / 2;
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bullet;
}