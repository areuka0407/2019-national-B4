class Curve extends Clip {
    constructor(){
        super(...arguments);

        this.history = [];
    }

    mousemove(e){
        this.history.push(this.getXY(e));
    }   
    
    mouseup(e, unset){
        unset();
    }

    draw(ctx, selected){
        // 선택되었을 때 테두리 칠하기
        if(selected){
            ctx.save();
            ctx.strokeStyle = this.selectedColor;
            ctx.lineWidth = ctx.lineWidth + 5;
    
            ctx.beginPath();   
            this.history.forEach(([X, Y]) => {
                ctx.lineTo(X, Y);
            });
            ctx.stroke();
            ctx.restore();
        }

        // 일반적으로 보여지는 선
        ctx.beginPath();  
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth; 
        this.history.forEach(([X, Y]) => {
            ctx.lineTo(X, Y);
        });
        ctx.stroke();
        
    }

    // 좌표를 재계산한다.
    reposition(){
        this.history = this.history.map(([X, Y]) => [X + this.x, Y + this.y]);
        this.x = this.y = 0;
    }
}