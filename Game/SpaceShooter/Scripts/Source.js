$(function() {
    var animation;

    var container = $('#container');
    var Plane = $('#Plane');
    var Enemy_1 = $('#Enemy_1');
    var Enemy_2 = $('#Enemy_2');
    var Enemy_3 = $('#Enemy_3');
    var Enemy_4 = $('#Enemy_4');
    var Enemy_5 = $('#Enemy_5');

    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');

    var score = $('#score');
    var kills = $('#kills');

    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var Plane_width = parseInt(Plane.width());
    var Plane_height = parseInt(Plane.height());

    var score_counter = 1;
    var speed = 3;

    var game_over = false;
    var isMoving_right = false;
    var isMoving_left = false;
    var isMoving_up = false;
    var isMoving_down = false;
    var shooting = false;



    $(document).on('keydown', function(e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37 && isMoving_left === false) {
                isMoving_left = requestAnimationFrame(left);
            }
            else if (key === 39 && isMoving_right === false) {
                isMoving_right = requestAnimationFrame(right);
            }
            else if (key === 38 && isMoving_up === false) {
                isMoving_up = requestAnimationFrame(up);
            }
            else if (key === 40 && isMoving_down === false) {
                isMoving_down = requestAnimationFrame(down);
            }
            else if (key === 32 ) {
               fire();
            }

        }
    });

    $(document).on('keyup', function(e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(isMoving_left);
                isMoving_left = false;
            }
            else if (key === 39) {
                cancelAnimationFrame(isMoving_right);
                isMoving_right = false;
            }
            else if (key === 38) {
                cancelAnimationFrame(isMoving_up);
                isMoving_up = false;
            }
            else if (key === 40) {
                cancelAnimationFrame(isMoving_down);
                isMoving_down = false;
            }
            else if (key === 32) {
                shooting = false;
            }

        }
    });

    //Player Movment
    function left() {
        if (game_over === false && parseInt(Plane.css('left')) > 0) {
            Plane.css('left', parseInt(Plane.css('left')) - 5);
            isMoving_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(Plane.css('left')) < container_width - Plane_width) {
            Plane.css('left', parseInt(Plane.css('left')) + 5);
            isMoving_right = requestAnimationFrame(right);
        }
    }

    function up() {
        if (game_over === false && parseInt(Plane.css('top')) > 0) {
            Plane.css('top', parseInt(Plane.css('top')) - 3);
            isMoving_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(Plane.css('top')) < container_height - Plane_height) {
            Plane.css('top', parseInt(Plane.css('top')) + 3);
            isMoving_down = requestAnimationFrame(down);
        }

    }

    animation = requestAnimationFrame(repeat);

    function repeat() {
        Destroy_Enemy();
        if (isColliding(Plane, Enemy_1) || isColliding(Plane, Enemy_2) || isColliding(Plane, Enemy_3) || isColliding(Plane, Enemy_4) || isColliding(Plane, Enemy_5)  ) {
            GameOver();
            return;
        }

        score_counter++;

        if (score_counter % 20 == 0)
        {
            score.text(parseInt(score.text()) + 1);
        }

        if (score_counter % 500 == 0)
        {
            speed++;
        }

        Enemy(Enemy_1);
        Enemy(Enemy_2);
        Enemy(Enemy_3);
        Enemy(Enemy_4);
        Enemy(Enemy_5);
        animation = requestAnimationFrame(repeat);

    }//Repeat

    function Enemy(Plane) {
        var Plane_current_top = parseInt(Plane.css('top'));
        if (Plane_current_top > container_height) {
            Plane_current_top = -200;
            var Plane_left = parseInt(Math.random() * (container_width - Plane_width));
            Plane.css('left', Plane_left);
        }

        Plane.css('top', Plane_current_top + speed);
    }//Enemy

    restart_btn.click(function () {
        location.reload();
    });

    function GameOver()
    {
        game_over = true;
        cancelAnimationFrame(animation);
        cancelAnimationFrame(isMoving_right);
        cancelAnimationFrame(isMoving_left);
        cancelAnimationFrame(isMoving_up);
        cancelAnimationFrame(isMoving_down);
        restart_div.slideDown();
        restart_btn.focus();
    }

    function isColliding($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;

        var h1 = $div1.outerHeight(true) - 45;
        var w1 = $div1.outerWidth(true) - 45;

        var b1 = y1 + h1;
        var r1 = x1 + w1;

        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;

        var h2 = $div2.outerHeight(true) -45;
        var w2 = $div2.outerWidth(true) - 45;

        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }


    function fire() {
        if (game_over === false) {
            shooting = true;
            var posY =parseInt(Plane.css("top"));
            var posX = parseInt(Plane.css("left"));
            $('#container').append($("<div>").addClass("bullet").css({"top": posY, "left": posX + 47}));

        }
    }
    function update() {
        $(".bullet").each(function() {
            var oldLeft = $(this).offset().top;
            console.log(oldLeft);
            $(this).css("top", oldLeft - 5);
        });
    }
    setInterval(update, 2 );

    function Bullet_Collision($div1, $div2) {

    var xPos_1 = $div1.css("left");
    var xPos_2 = $div2.css("left");
    var KillRange = parseInt(xPos_1) - parseInt(xPos_2);

    if(KillRange > -20 && KillRange < 20) {
        return true;
    }
    else {
        return false;
    }

    }

  function Destroy_Enemy() {
    if(shooting == true && Bullet_Collision(Plane,Enemy_1)) {
        Enemy_1.css("top" , 1000);
        score.text(parseInt(score.text()) + 10);
        kills.text(parseInt(kills.text()) + 1);
    }
   else if(shooting == true && Bullet_Collision(Plane,Enemy_2)) {
       Enemy_2.css("top" , 1000);
        score.text(parseInt(score.text()) + 10);
        kills.text(parseInt(kills.text()) + 1);

    }
    else if(shooting == true && Bullet_Collision(Plane,Enemy_3)) {
        Enemy_3.css("top" , 1000);
        score.text(parseInt(score.text()) + 10);
        kills.text(parseInt(kills.text()) + 1);
    }
    else if(shooting == true && Bullet_Collision(Plane,Enemy_4)) {
        Enemy_4.css("top" , 1000);
        score.text(parseInt(score.text()) + 10);
        kills.text(parseInt(kills.text()) + 1);
    }
    else if(shooting == true && Bullet_Collision(Plane,Enemy_5)) {
        Enemy_5.css("top" , 1000);
        score.text(parseInt(score.text()) + 10);
        kills.text(parseInt(kills.text()) + 1);
    }

  }
  

});

