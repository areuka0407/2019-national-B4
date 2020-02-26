class Rect extends Clip {
    constructor(){
        super(...arguments);

        this.data = { x: 0, y: 0, w: 0, h: 0 };
        this.firstX = this.firstY = 0;
        this.complete = false;
    }

    mousedown(e){
        let [X, Y] = this.getXY(e);
        this.data.x = this.firstX = X;
        this.data.y = this.firstY = Y;
    }

    mousemove(e) {
        let [X, Y] = this.getXY(e);
        let {x, y, w, h} = this.data;

        w = X - this.firstX;
        h = Y - this.firstY;

        if(w < 0){
            x = this.firstX + w;
            w *= -1;
        }
        if(h < 0){
            y = this.firstY + h;
            h *= -1;
        }
        this.data = {x, y, w, h};
    }
    
    mouseup(e, unset){
        unset();
        this.complete = true;
    }


    draw(ctx, selected){
        let {x, y, w, h} = this.data;

        // 선택시 보여지는 테두리
        if(selected){
            ctx.save();
            ctx.lineWidth = 5;
            ctx.fillStyle = this.selectedColor;
            ctx.fillRect(x - 5, y -5, w + 10, h + 10);
            ctx.restore();
        }

        // 기본적으로 보여지는 사각형
        ctx.lineWidth = 5;
        ctx.strokeStyle = ctx.fillStyle = this.color;

        if(this.complete) ctx.fillRect(x, y, w, h);
        else ctx.strokeRect(x, y, w, h);
    }

    reposition(){
        this.data.x += this.x;
        this.data.y += this.y;
        this.x = this.y = 0;
    }
}