class Text extends Clip {
    constructor(){
        super(...arguments);

        this.data = { x: 0, y: 0, text: "" };
    }

    mousedown(e, unset){
        let [X, Y] = this.getXY(e);
        this.data.x = X;
        this.data.y = Y;
        this.$input = document.createElement("input");
        this.$input.style.left = X + "px";
        this.$input.style.top = Y + "px";
        this.$input.style.color = this.ctx.fillStyle;
        this.$input.style.font = this.ctx.font;
        this.$input.addEventListener("input", e => {
            this.$input.style.width = this.$input.scrollWidth + "px";
        });
        this.$input.addEventListener("blur", e => {
            this.data.text = this.$input.value;
            this.$input.remove();
            unset();
        });

        this.viewport.$root.append(this.$input);
    }

    mouseup(e){
        this.$input.focus();
    }

    draw(ctx){
        let {text, x, y} = this.data;
        let {width} = ctx.measureText(text);
        let height = parseInt(this.ctx.font);

        // 선택시 보여지는 테두리
        if(this.selected){
            ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = this.selectedColor;
            ctx.strokeRect(x, y, width, height + 5);
            ctx.restore();
        }

        // 기본적으로 보여지는 텍스트
        ctx.fillText(text, x, y + height);
    }
}