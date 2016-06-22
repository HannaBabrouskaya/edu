function clockModel( _tz, _city) {
    var city = _city;
    var tz = _tz;
    var status;
    var myView = null;

    this.init = function(view) {
        myView = view;
    }

    this.getCity = function() {
        return city;
    }

    this.getTz = function() {
        return tz;
    }

    this.setStatus = function(s) {
        status = s;
    }

    this.getStatus = function(){
        return status;
    }

    this.getCurrentDate = function(f) {
        var c = new Date(Date.now() + tz * 1000 * 60 * 60);
        // возврат часов, минут, секунда в зависимости от параметра
        if (f == 'h') {
            return c.getUTCHours();
        } else if (f == 'm') {
            return c.getUTCMinutes();
        } else if (f == 's') {
            return c.getUTCSeconds();
        } 
        // если параметра нет, функция возвращает кол-во миллисекунд по UTC с учетом сдвига часовго пояса
        return Date.now() + tz * 1000 * 60 * 60;  
    }

    this.updateView = function() {
        if(myView) {
            myView.update();
        }
    }
}

function clockView() {
    var myModel = null, // с какой моделью работаем
        myField = null, // внутри какого элемента DOM наша вёрстка
        hourArrowObj = document.createElement('div'),
        minuteArrowObj = document.createElement('div'),
        secArrowObj = document.createElement('div'),
        electroClock = document.createElement('div'),
        stopButton = document.createElement('button'),
        startButton = document.createElement('button');

    function draw() {
        var clockObj = document.createElement('div');
        var timeWrap = document.createElement('span');
        var hoursLength = 12;

        myField.className = 'clockWrapper';
        myField.appendChild(clockObj);
        myField.insertBefore(stopButton, clockObj);
        myField.insertBefore(startButton, clockObj);
        myField.insertBefore(timeWrap, clockObj);

        stopButton.innerHTML = "стоп";
        startButton.innerHTML = "старт";

        timeWrap.innerHTML = ' ' + myModel.getCity() + ' ' + '(' + 'GMT' + ' ' +
            ((myModel.getTz() < 0) ? myModel.getTz() :
                (myModel.getTz() > 0) ? ('+' + myModel.getTz()) : ' ') + ')';

        clockObj.classList.add("clocks");
        hourArrowObj.classList.add("arrows", "hourArrow");
        minuteArrowObj.classList.add("arrows", "minuteArrow");
        secArrowObj.classList.add("arrows", "secArrow");
        electroClock.classList.add("electroClock");
        stopButton.classList.add("stopButton");
        startButton.classList.add("startButton");

        var clockRadius = parseInt(getComputedStyle(clockObj).width) / 2;
        secArrowObj.style.bottom = clockRadius - secArrowObj.offsetHeight + "px";
        minuteArrowObj.style.bottom = clockRadius - minuteArrowObj.offsetHeight + "px";
        hourArrowObj.style.bottom = clockRadius - minuteArrowObj.offsetHeight + "px";

        for (var n = 1; n <= hoursLength; n++) {
            var divisionsObj = document.createElement('div');
            divisionsObj.classList.add("divisions");

            var circle = n * (Math.PI * 2) / hoursLength;
            var x = clockRadius * 0.8 * Math.cos(circle);
            var y = clockRadius * 0.8 * Math.sin(circle);
            
            divisionsObj.innerHTML = n;

            clockObj.appendChild(divisionsObj);

            divisionsObj.style.bottom = x + clockRadius - divisionsObj.offsetHeight/2;
            divisionsObj.style.left = y + clockRadius - divisionsObj.offsetWidth/2;
        }
        clockObj.appendChild(secArrowObj);
        clockObj.appendChild(minuteArrowObj);
        clockObj.appendChild(hourArrowObj);
        clockObj.appendChild(electroClock);
    }

    this.update = function() {
        for (var n = 1; n <= 59; n++) {
            var hours = myModel.getCurrentDate("h");
            var minutes = myModel.getCurrentDate("m");
            var seconds = myModel.getCurrentDate("s");

            var t_sec = 6*seconds;
            var t_min = 6*(minutes + (1/60)*seconds);
            var t_hour = 30*(hours + (1/60)*minutes);

            secArrowObj.style.transform = "rotate("+(t_sec)+"deg)";
            minuteArrowObj.style.transform = "rotate("+(t_min)+"deg)";
            hourArrowObj.style.transform = "rotate("+(t_hour)+"deg)";

            electroClock.innerHTML = ((hours < 10) ? ('0'+hours) : hours) + ':' + ((minutes < 10) ? ('0'+minutes) : minutes) + ':' + ((seconds < 10) ? ('0'+seconds) : seconds);
        }
    }

    this.init = function(model, field, _id) {
        myModel = model;
        myField = field;

        var id = _id;

        draw();

        console.log(localStorage.getItem(id));
        if( localStorage.getItem(id) == 2) {
            myModel.updateView();
        }
    }
}

function clockController() {
    var myModel = null; // с какой моделью работаем
    var myField = null; // внутри какого элемента DOM наша вёрстка
    var tick;

    this.start = function(model, field, _id) {
        myModel = model;
        myField = field;

        var id = _id;
        var startButton = myField.querySelector('.startButton');

        startButton.addEventListener('click', function() {
            myModel.setStatus(2);
            localStorage.setItem(id,JSON.stringify(myModel.getStatus()));
            tick = setInterval(myModel.updateView, 1000);
        });
    }

    this.stop = function(model, field, _id) {
        myModel = model;
        myField = field;

        var id = _id;
        var stopButton = myField.querySelector('.stopButton');

        stopButton.addEventListener('click', function() {
            myModel.setStatus(3);
            localStorage.removeItem(id);
            clearInterval(tick);
        });
    }
}

var clockArray = [
    {
        timeZone: "-5",
        name: 'Нью-Йорк'
    },
    {
        timeZone: "0",
        name: 'Лондон'
    },
    {
        timeZone: "1",
        name: 'Берлин'
    },
    {
        timeZone: "3",
        name: 'Минск'
    },
    {
        timeZone: "9",
        name: 'Токио'
    },
    {
        timeZone: "10",
        name: 'Владивосток'
    },
]

function initializeClocks(_clockArray) {
    var mainDiv = [],
        c = [],
        v = [],
        contr = [];

    _clockArray.forEach(function(item, index, array) {
        mainDiv.index = document.createElement('div');
        document.body.appendChild(mainDiv.index);

        c.index = new clockModel(item.timeZone, item.name);
        v.index = new clockView();
        contr.index = new clockController();
        c.index.init(v.index);
        v.index.init(c.index, mainDiv.index, "c"+index);
        contr.index.start(c.index, mainDiv.index, "c"+index);
        contr.index.stop(c.index, mainDiv.index, "c"+index);
    });

}

window.onload = function() {
    initializeClocks(clockArray);
}
