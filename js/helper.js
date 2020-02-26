function selector(target){
    return document.querySelector(target);
}
function selectorAll(target){
    return document.querySelectorAll(target);
}
function log(contents){
    return console.log(contents);
}
Number.prototype.toVideoTime = function(){
    let ms = parseInt(this.toFixed(2).substr(-2));
    let sec = parseInt(this % 60);
    let min = parseInt(this / 60) % 60;
    let hour = parseInt(this / 3600);

    if(ms < 10) ms = "0" + ms;
    if(sec < 10) sec = "0" + sec;
    if(min < 10) min = "0" + min;
    if(hour < 10) hour = "0" + hour;
    
    return `${hour}:${min}:${sec}:${ms}`;
}