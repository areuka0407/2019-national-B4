class Track {
    constructor(viewport, idx){
        this.app = viewport.app;
        this.viewport = viewport;
        this.idx = idx;

        let {width, height} = viewport;

        this.$canvas = document.createElement("canvas");
        this.ctx = this.$canvas.getContext("2d");

        this.$video = document.createElement("video");
        this.$video.src = `videos/movie${idx}.mp4`;

        this.width = this.$canvas.width = this.$video.width = width;
        this.height = this.$canvas.height = this.$video.height = height;
        
        this.clipList = [];
        this.curve = () => new Curve(this);
        this.rect = () => new Rect(this);
        this.text = () => new Text(this);


        this.$clipList = document.createElement("div");
        this.$clipList.innerHTML = `<div class="line"></div>
                                    <div class="cursor"></div>`
        this.$cursor = this.$clipList.querySelector(".cursor");
        this.$cursor.addEventListener("dragstart", e => e.preventDefault());
        this.$cursor.addEventListener("mousedown", e => {
            if(e.which !== 1) return;
            this.$cursor.clicked = true;
        });
        window.addEventListener("mousemove", e => {
            if(!this.$cursor.clicked || e.which !== 1) return;
        
            let {left} = $(this.$clipList).offset();
            let {offsetWidth} = this.$clipList;
            let x = e.pageX - left;
            x = x < 0 ? 0 : x > offsetWidth ? offsetWidth : x;
            this.$video.currentTime = this.$video.duration * x / offsetWidth;
            
            this.$cursor.style.left = x + "px";
        });
        window.addEventListener("mouseup", e => {
            this.$cursor.clicked = false;
        });
    }

    // 새로운 클립을 추가한다.
    addClip(clip){
        this.$clipList.prepend(clip.$line);
        this.clipList.push(clip);
    }

    // 현재 영화의 재생시간에 따라 커서의 X 값을 변화시킨다.
    updateCursor(){
        let {currentTime, duration} = this.$video;
        this.$cursor.style.left = (100 * currentTime / duration) + "%";
    }

    // 가지고 있는 모든 클립을 그린다.
    drawAll(){
        let {currentTime} = this.$video;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.clipList.forEach(clip => {
            let {startTime, duration} = clip;
            if(startTime <= currentTime && currentTime <= startTime + duration){
                clip.update();
                this.ctx.drawImage(clip.$canvas, clip.x, clip.y);
            }
        });
    }

    // Viewport 에서 보낸 이벤트 객체와 일치하는 대상을 찾아낸다.
    selectItem(e){
        this.clipList.forEach(x => x.blur());
        let find = this.clipList.find(clip => {
                        let [X, Y] = clip.getXY(e);
                        clip.update();

                        let data = clip.ctx.getImageData(X - clip.x, Y - clip.y, 1, 1).data;
                        return data[3] !== 0;
                    });
        find && find.focus();
        return find;
    }

    // 선택된 클립을 삭제한다.
    seldel(){
        let idx = this.clipList.findIndex(clip => clip.selected);
        if(idx >= 0){
            let clip = this.clipList[idx];
            clip.blur();
            clip.$line.remove();
            this.clipList.splice(idx, 1);
        }
    }

    // 모든 클립을 삭제한다.
    alldel(){
        this.clipList.forEach(x => {
            x.blur();
            x.$line.remove()
        });
        this.clipList = [];
    }
}