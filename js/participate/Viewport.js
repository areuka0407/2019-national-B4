class Viewport {
    constructor(app){
        this.app = app;
        this.$root = selector("#viewport");
        this.width = this.$root.offsetWidth;
        this.height = this.$root.offsetHeight;

        this.$currentTime = selector("#play-time .current-time");
        this.$duration = selector("#play-time .duration");

        // 트랙을 생성한다
        this.trackIdx = null;
        this.trackList = [];
        for(let i = 1; i <= 5; i++){
            this.trackList.push( new Track(this, i) );
        }

        this.setEvent();
    }
    // 현재 선택된 트랙을 가져온다.
    get currentTrack(){
        return this.trackIdx === null ? null : this.trackList[this.trackIdx];
    }

    // 트랙을 변경한다.
    setTrack(id){
        if(this.currentTrack) {
            this.currentTrack.$video.remove();
            this.currentTrack.$canvas.remove();
            this.currentTrack.$clipList.remove();
        }

        this.trackIdx = id;
        this.currentTrack.$video.currentTime = 0;
        this.$root.prepend(this.currentTrack.$video);
        this.$root.append(this.currentTrack.$canvas);
        this.render();
    }

    play(){
        if(!this.currentTrack) console.error("영화가 먼저 선택 되어야 합니다.");
        this.currentTrack.$video.play();
    }
    pause(){
        if(!this.currentTrack) console.error("영화가 먼저 선택 되어야 합니다.");
        this.currentTrack.$video.pause();
    }

    setEvent(){
        // 클립을 새로 생성할 때
        let mouseTarget = null;
        let unset = () => mouseTarget = null;
        this.$root.addEventListener("mousedown", e => {
            if(mouseTarget || !this.currentTrack || e.which !== 1 || !this.app.type || this.app.type === "select") return;

            mouseTarget = this.currentTrack[this.app.type]();
            this.currentTrack.addClip(mouseTarget);
            mouseTarget.mousedown && mouseTarget.mousedown(e, unset);
        });
        window.addEventListener("mousemove", e => {
            if(!mouseTarget || e.which !== 1) return;
            mouseTarget.mousemove && mouseTarget.mousemove(e, unset);
        });
        window.addEventListener("mouseup", e => {
            if(!mouseTarget || e.which !== 1) return;
            mouseTarget.mouseup && mouseTarget.mouseup(e, unset);
        });

        // 클립을 선택할 때
        let selectTarget = null, first, copy;
        this.$root.addEventListener("mousedown", e => {
            if(selectTarget || !this.currentTrack || e.which !== 1 || this.app.type !== "select") return;
            selectTarget = this.currentTrack.selectItem(e);
            if(selectTarget){
                copy = [selectTarget.x, selectTarget.y];
                first = selectTarget.getXY(e);
            }
        });
        window.addEventListener("mousemove", e => {
            if(!selectTarget || e.which !== 1 || this.app.type !== "select") return;
            let [fx, fy] = first;
            let [cx, cy] = copy;
            let [X, Y] = selectTarget.getXY(e);
             selectTarget.x = cx + X - fx;
             selectTarget.y = cy + Y - fy;
        });

        window.addEventListener("mouseup", e => {
            if(!selectTarget || e.which !== 1 || this.app.type !== "select") return;
            selectTarget = null;
        });
    }


    // 현재 화면의 요소들을 프레임 단위로 제어한다.
    render(){
        requestAnimationFrame(() => {
            this.render();
        });
        
        if(this.currentTrack){
            // 재생 시간 변경
            const {currentTime, duration} = this.currentTrack.$video;
            this.$currentTime.innerText = currentTime.toVideoTime();
            this.$duration.innerText = duration.toVideoTime();
            this.currentTrack.updateCursor();

            // 클립 보여주기
            this.currentTrack.drawAll();
        }
    }
}