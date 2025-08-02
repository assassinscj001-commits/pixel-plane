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

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Particle;
}