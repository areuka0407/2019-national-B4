class App {
    constructor(){
        this.$noVideo = selector("#no-video");
        this.viewport = new Viewport(this);

        this.$i_color = selector("#color-input");
        this.$i_width = selector("#width-input")
        this.$i_font = selector("#font-input");

        this.$clipArea = selector("#clip-area");

        this.setEvent();
    }

    get color(){ return this.$i_color.value; }
    get lineWidth(){ return this.$i_width.value; }
    get font(){ return this.$i_font.value; }
    get type(){
        let find = selector("#button-bar .tool.active");
        return !find ? null : find.dataset.name;
    }


    // 이벤트를 건다
    setEvent(){
        // 영화 변경
        selectorAll("#movie-list img").forEach((x, i) => {
            x.addEventListener("click", e => {
                this.$noVideo.remove();
                this.viewport.setTrack(i);

                this.$clipArea.innerHTML = "";
                this.$clipArea.append(this.viewport.currentTrack.$clipList);
            }); 
        });

        // 기능 버튼들
        const buttonEvent = () => {
            if(!this.viewport.currentTrack) {
                alert("영상을 먼저 선택해 주세요!");
                return false;
            }
            return true;
        }
        selector("#btn-play").addEventListener("click", () => buttonEvent() && this.viewport.play());
        selector("#btn-pause").addEventListener("click", () => buttonEvent() && this.viewport.pause());
        selector("#btn-seldel").addEventListener("click", () => buttonEvent() && this.viewport.currentTrack.seldel());
        selector("#btn-alldel").addEventListener("click", () => buttonEvent() && this.viewport.currentTrack.alldel());
        selectorAll("#button-bar .tool").forEach(x => {
            x.addEventListener("click", () => {
                if(!buttonEvent()) return;
                this.type && selector("#btn-"+this.type).classList.remove("active");
                x.classList.add("active");
            });        
        });
    }
}

window.onload = () => {
    let editor = new App();
};