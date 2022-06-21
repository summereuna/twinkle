const Time = () => {
    function getTime(){
        const date = new Date();
        const hours = date.getHours();
        const minute = date.getMinutes();
        const seconds = date.getSeconds();
        clockTitle.innerText = `${hours}:${minute}:${seconds}`;
    }
    
    function init(){
        getTime();
        setInterval(getTime, 1000);
    }
    
    init();
    
    return()
}

export default Time;