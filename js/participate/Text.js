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
        this.$input.style.color = this.color;
        this.$input.style.font = this.font;
        this.$input.addEventListener("input", e => {
            this.$input.style.width = this.$input.scrollWidth + "px";
        });
        this.$input.addEventListener("blur", e => {
            if(e.target.value.trim() !== ""){
                this.data.text = this.$input.value;
            }
            else {
                this.$line.remove();
                let idx = this.track.clipList.findIndex(x => x === this);
                this.track.clipList.splice(idx, 1);
            }
            this.$input.remove();
            unset();
        });

        this.viewport.$root.append(this.$input);
    }

    mouseup(e){
        this.$input.focus();
    }

    draw(ctx, selected){
        ctx.fillStyle = this.color;
        ctx.font = this.font;

        let {text, x, y} = this.data;
        let {width} = ctx.measureText(text);
        let height = parseInt(this.ctx.font);

        // 선택시 보여지는 테두리
        if(selected){
            ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = this.selectedColor;
            ctx.strokeRect(x, y, width, height + 5);
            ctx.restore();
        }

        // 기본적으로 보여지는 텍스트
        ctx.fillText(text, x, y + height);
    }

    reposition(){
        this.data.x += this.x;
        this.data.y += this.y;
        this.x = this.y = 0;
    }
}