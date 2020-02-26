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

    draw(ctx){
        // 선택되었을 때 테두리 칠하기
        if(this.selected){
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
        this.history.forEach(([X, Y]) => {
            ctx.lineTo(X, Y);
        });
        ctx.stroke();
        
    }
}