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

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowerUp;
}