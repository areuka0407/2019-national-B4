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
        selector("#btn-download").addEventListener("click", () => buttonEvent() && this.download());
        selector("#btn-reset").addEventListener("click", () => buttonEvent() && location.reload());
        selector("#btn-merge").addEventListener("click", () => buttonEvent() && this.viewport.currentTrack.merge());
        selectorAll("#button-bar .tool").forEach(x => {
            x.addEventListener("click", () => {
                if(!buttonEvent()) return;
                this.type && selector("#btn-"+this.type).classList.remove("active");
                x.classList.add("active");
            });        
        });
    }

    download(){
        let html = this.outerHTML();
        log(html);
        let blob = new Blob([html], {type: "text/html"});
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        let date = new Date();
        a.href = url;
        a.download = "movie-" + date.today() + ".html";
        document.body.append(a);
        a.click();
        a.remove();
    }
    
    outerHTML(){
        let output   = `<style>
                            #viewport {
                                max-width: 1000px;
                                height: 600px;
                                background-color: #000;
                                position: relative;
                            }
                            #viewport video, #viewport img {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                user-select: none;
                                pointer-events: none;
                                visibility: visible;
                            }
                            #btn-play {
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                                background: none;
                                border: none;
                                color: #fff;
                                font-size: 1.5em;
                                z-index: 100;
                            }
                        </style>
                        <div id="viewport">
                            <button id="btn-play">재생</button>`;
        output += `<video src="${this.viewport.currentTrack.$video.src}"></video>`;
        
        let selected = this.viewport.currentTrack.clipList.find(x => x.selected);
        this.viewport.currentTrack.clipList.forEach(clip => {
            clip.blur();
            clip.update();
            let url = clip.$canvas.toDataURL("image/png");
            output += `<img src="${url}" alt="clip-image" data-start="${clip.startTime}" data-duration="${clip.duration}">`;
        });
        selected && selected.focus();

        output += `</div>
                            <script>
                                window.onload = () => {
                                    let $video = document.querySelector("#viewport video");
                                    let $images = document.querySelectorAll("#viewport img");
                                    let $playBtn = document.querySelector("#btn-play");
                                    $playBtn.addEventListener("click", () => {
                                        $video.play();
                                        $playBtn.remove();
                                    });
                            
                                    function render(){
                                        $images.forEach(img => {
                                            let currentTime = $video.currentTime;
                                            let start = img.dataset.start * 1;
                                            let duration = img.dataset.duration * 1;
                            
                                            if(start <= currentTime && currentTime <= start + duration) img.style.visibility = "visible";
                                            else img.style.visibility = "hidden";
                                        });
                            
                                        requestAnimationFrame(render);
                                    }
                                    render();
                                };
                            </script>`;
        return output;
    }
}

window.onload = () => {
    let editor = new App();
};