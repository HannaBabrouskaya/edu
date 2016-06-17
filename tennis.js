var racketObjSec=document.getElementById('raket2'),
    racketObj=document.getElementById('raket1'),
    tichInterval;

var AreaH=
{
    Width : 500,
    Height : 400
}

var settings=
{
    PositionX : 200,
    PositionY : 150
}

var BallH=
{
    PosX : 200,
    PosY : 150,
    SpeedX : 5,
    SpeedY : 4,
    Width : 80,
    Height: 100,
    Update : function()
    {
        var BallObj=document.getElementById('IBall');
        BallObj.style.left=this.PosX+"px";
        BallObj.style.top=this.PosY+"px";
    }
}

var Racket1=
{
    PosX : 0,
    PosY : 0,
    SpeedX : 2,
    SpeedY : 5,
    Width : 20,
    Height: 200,
    Update : function()
    {
        racketObj.style.left=this.PosX+"px";
        racketObj.style.top=this.PosY+"px";
    }
}

var Racket2=
{
    PosX : 0,
    PosY : 0,
    SpeedX : 2,
    SpeedY : 5,
    Width : 20,
    Height: 200,
    Update : function()
    {
        racketObjSec.style.right=this.PosX+"px";
        racketObjSec.style.top=this.PosY+"px";
    }
}

function Start(){
    if(tichInterval) {
        BallH.PosX = settings.PositionX;
        BallH.PosY = settings.PositionY;
        BallH.Update();
        clearInterval(tichInterval);
        tichInterval = 0;
    } else {
        tichInterval = setInterval(Tick,40);
    }
}

function RacketMove(){
    window.onkeydown = function(evt) {
        var charCode = evt.keyCode;

        if(evt.ctrlKey) {
           if(Racket1.PosY < AreaH.Height - Racket1.Height) {
                Racket1.PosY +=Racket1.SpeedY;
                racketObj.style.top=Racket1.PosY +"px";
            }
        } else if (evt.shiftKey) {
            if(Racket1.PosY > 0) {
                Racket1.PosY -= Racket1.SpeedY;
                racketObj.style.top=Racket1.PosY +"px";
            }
        } else if (charCode == '40') {
            if(Racket2.PosY < AreaH.Height - Racket2.Height) {
                Racket2.PosY += Racket2.SpeedY;
                racketObjSec.style.top=Racket2.PosY +"px";
            }
        } else if (charCode == '38') {
            if(Racket2.PosY > 0) {
                Racket2.PosY -= Racket2.SpeedY;
                racketObjSec.style.top=Racket2.PosY +"px";
            }
        }
    }
}
RacketMove();

function Tick(){
    BallH.PosX+=BallH.SpeedX;

    if(BallH.PosY < Racket2.PosY + Racket2.Height && BallH.PosY > Racket2.PosY && BallH.PosX+BallH.Width>AreaH.Width - Racket2.Width || BallH.PosY + BallH.Height > Racket2.PosY && BallH.PosY + BallH.Height < Racket2.PosY + Racket2.Height && BallH.PosX+BallH.Width>AreaH.Width - Racket2.Width){
            BallH.SpeedX=-BallH.SpeedX;
            BallH.PosX=AreaH.Width-BallH.Width - Racket2.Width;
    } else if (BallH.PosY < Racket1.PosY + Racket1.Height && BallH.PosY > Racket1.PosY && BallH.PosX<Racket1.Width || BallH.PosY + BallH.Height > Racket1.PosY && BallH.PosY + BallH.Height < Racket1.PosY + Racket1.Height && BallH.PosX<Racket1.Width){
            BallH.SpeedX=-BallH.SpeedX;
            BallH.PosX=Racket1.Width;
    } else if( BallH.PosX<0 || BallH.PosX+BallH.Width>AreaH.Width) {
        if (BallH.PosX<0) {
            var counter2 = document.getElementById('counter2');
            counter2.textContent = parseInt(counter2.textContent) + 1;
        } else {
            var counter = document.getElementById('counter1');
            counter.textContent = parseInt(counter.textContent) + 1;
        }
        BallH.PosX = settings.PositionX;
        BallH.PosY = settings.PositionY;
        BallH.Update();
        clearInterval(tichInterval);
        tichInterval = 0;
    }

    BallH.PosY+=BallH.SpeedY;
    if ( BallH.PosY+BallH.Height>AreaH.Height )
    {
        BallH.SpeedY=-BallH.SpeedY;
        BallH.PosY=AreaH.Height-BallH.Height;
    }

    if ( BallH.PosY<0 )
    {
        BallH.SpeedY=-BallH.SpeedY;
        BallH.PosY=0;
    }

    BallH.Update();
}

BallH.Update();
