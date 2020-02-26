class Clip {
    constructor(track){
        this.x = 0;
        this.y = 0;
        this.startTime = 0;
        this.duration = track.$video.duration;        

        this.$startTime = selector("#clip-time .start-time");
        this.$duration = selector("#clip-time .duration");

        this.app = track.app;
        this.viewport = track.viewport;
        this.track = track;
        this.drawList = [(ctx, selected) => {
            this.draw.apply(this, [ctx, selected]);
        }];
        this.selected = false;
        this.selectedColor = "#116aab";

        let {width, height} = this.track;
        this.$canvas = document.createElement("canvas");
        this.$canvas.width = width;
        this.$canvas.height = height;
        this.ctx = this.$canvas.getContext("2d");

        this.ctx.lineJoin = this.ctx.lineCap = "round";
        this.color = this.app.color;
        this.font = this.app.font;
        this.lineWidth = this.app.lineWidth;

        this.$line = document.createElement("div");
        this.$line.classList.add("line", "clip")
        this.$line.draggable = true;
        this.$line.innerHTML = `<input type="checkbox">
                                <div class="view-line">
                                    <div class="left"></div>
                                    <div class="center"></div>
                                    <div class="right"></div>
                                </div>`;
        this.$viewLine = this.$line.querySelector(".view-line");
        this.$line.addEventListener("click", e => this.focus());

        // 재생 시간 조절하기
        let lineData = null;
        this.$line.querySelector(".view-line").addEventListener("mousedown", e => {
            let target = e.target.classList.value;
            let firstX = e.pageX - $(this.$line).offset().left;
            firstX = firstX < 0 ? 0 : firstX > this.$line.offsetWidth ? this.$line.offsetWidth : firstX;

            let _width = this.$viewLine.offsetWidth;
            let _left = this.$viewLine.offsetLeft;
            lineData = {target, firstX, _width, _left};
        });
        window.addEventListener("mousemove", e => {
            if(lineData === null || e.which !== 1) return;

            let offsetLeft = $(this.$line).offset().left;
            let {offsetWidth} = this.$line;
            let X = e.pageX - offsetLeft;
            X = X < 0 ? 0 : X > offsetWidth ? offsetWidth : X;
            
            let {target, firstX, _width, _left} = lineData;
            let x, w;

            if(target === "left"){
                x = X;
                x = x > (_left + _width - 30) ? _left + _width - 30 : x;
                w = _width + _left - X;
            }
            else if(target === "center"){
                x = _left + X - firstX
                w = _width;
            }
            else if(target === "right"){
                x = _left;
                w = X - _left;
            }

            x = x < 0 ? 0 : x + w > offsetWidth ? offsetWidth - w : x;
            w = w < 30 ? 30 : w;

            this.$viewLine.style.left = x + "px";
            this.$viewLine.style.width = w + "px";

            this.startTime = this.track.$video.duration * x / offsetWidth;
            this.duration = this.track.$video.duration * w / offsetWidth;
            this.timeUpdate();
        });
        window.addEventListener("mouseup", e => {
            lineData = null;
        });

        // 위치 바꾸기
        this.$line.addEventListener("dragstart", e => this.track.dragItem = this);
        this.$line.addEventListener("dragover", e => e.preventDefault());
        this.$line.addEventListener("drop", e => {
            this.track.dropItem = this;
            this.track.swapClip();
        });
    }

    get merged(){
        return this.$line.querySelector("input").checked;
    }

    set merged(value){
        this.$line.querySelector("input").checked = value;
    }

    // 시간 표시기를 갱신시킨다.
    timeUpdate(){
        this.$startTime.innerText = this.startTime.toVideoTime();
        this.$duration.innerText = this.duration.toVideoTime();
    }


    // 이 클립을 활성화 시킨다. => 선택된 클립으로 만든다.
    focus(){
        let exist = this.track.clipList.find(x => x.selected);
        if(exist) exist.blur();

        this.selected = true;
        this.$line.classList.add("active");
        this.timeUpdate();
    }
    // 클립 비활성화
    blur(){
        this.selected = false;
        this.$line.classList.remove("active");

        this.$startTime.innerText = this.$duration.innerText = "00:00:00:00";
    }

    update(){
        // 캔버스 칠하기
        let {width, height} = this.$canvas;
        this.ctx.clearRect(0, 0, width, height);
        this.drawList.forEach(draw => draw(this.ctx, this.selected));
    }



    getXY(e){
        let {pageX, pageY} = e;
        let {offsetWidth, offsetHeight} = this.viewport.$root;
        let {left, top} = $(this.viewport.$root).offset();
        
        let X = pageX - left;
        X = X < 0 ? 0 : X > offsetWidth ? offsetWidth : X;

        let Y = pageY - top;
        Y = Y < 0 ? 0 : Y > offsetHeight ? offsetHeight : Y;

        return [X, Y];
    }
}