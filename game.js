var config = {
    type: Phaser.AUTO,
    width: 1334,
    height: 750,
    parent: 'gameContainer',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene:{
        preload: preload,
        create: create,
        update: update
    },
    physics:{
        default: "arcade",
        arcade: {
            gravity: { y:0 },
            debug: false
        }
    }

};

var game = new Phaser.Game(config);
var scene;
var player;
var keyup, keydown, keyRight, KeyLeft, keyFire;
var bulletSpeed = 1200;
var playerBulletgrp;

var explosionGrp;

var ufoGrp;
var ufoSpacing = 130;

var ufoBulletGrp;

var playerHeart = 3;
var heartGrp;

var running;
function preload(){
    running = true;
    //console.log("preload");
    scene = this;
    scene.load.image('player', './asset/image/DiwdoW3539.png');
    scene.load.image('bullet', './asset/image/DiwdoW3539_2.png');
    //scene.load.image('tu', './asset/image/tu.jpg');
    scene.load.image('lungtu', './asset/image/logotransparent.png');
    scene.load.image('explosion1', './asset/image/explosion1.png');
    scene.load.image('explosion2', './asset/image/explosion2.png');
    scene.load.image('ufo_bullet', './asset/image/ufo_bullet.png');
    scene.load.image('heart', './asset/image/heart.png');
    //scene.load.image('me', './asset/image/5290.jpg');
    scene.load.image('me', './asset/image/me.png');
}

function create(){
    //console.log("create");
    createPlayer();
    playerBulletgrp = scene.add.group();

    ufoGrp = scene.add.group();
    ufoBulletGrp = scene.add.group();
    createUFO();

    explosionGrp = scene.add.group();

    heartGrp = scene.add.group();
    createPlayerHeart();

    scene.physics.add.overlap(ufoGrp, playerBulletgrp, onUFOHIT);
    scene.physics.add.overlap(player, ufoBulletGrp, onPlayerHIT);
    scene.physics.add.overlap(player, ufoGrp, onPlayerHIT);

    keyup = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keydown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    KeyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function createUFO(){
    for(var i = 0; i < 5; i++){
        var ufo = scene.physics.add.sprite(1500, 100 + (i * ufoSpacing), "lungtu");
        ufo.setScale(0.2);
        ufo.speed = (Math.random() * 2) + 1;
        ufo.startx = config.width + (ufo.width/2);
        ufo.starty = 100 + (i * ufoSpacing);
        ufo.x = ufo.startx;
        ufo.y = ufo.starty;
        ufo.magnitude = Math.random() * 60;
        ufo.fireInterval = (Math.random() * 3000) + 1500;
        if(running == true){
            ufo.fireTime = scene.time.addEvent({
                delay: ufo.fireInterval,
                args: [ufo],
                callback: ufoFire,
                repeat: -1
            });
        }
            
        ufoGrp.add(ufo);
    }
}
function createPlayer(){
    player = scene.physics.add.sprite(config.width/2, config.height/2, 'player');
    player.speed = 400;
    player.setScale(1.5);
    player.immortal = false;
}

function update(){
    if(running == true){
        updatePlayer();
        updatePlayerBullets();
    
        updateUFO();
    
        updateExplosion();
    
        updateUFOBullet();
    }
}
function updateUFOBullet(){
    for(var i = 0; i < ufoBulletGrp.getChildren().length; i ++){
        var bullet = ufoBulletGrp.getChildren()[i];

        if(bullet.x < 0 - (bullet.width/2)){
            bullet.destroy();
        }
    }
}
function updateUFO(){
    for(var i = 0 ; i < ufoGrp.getChildren().length; i++){
        var enemy = ufoGrp.getChildren()[i];
        enemy.x -= enemy.speed;
        enemy.y = enemy.starty + (Math.sin(game.getTime()/1000) * enemy.magnitude);
        if(enemy.x < 0 -(enemy.width/2)){
            enemy.speed = (Math.random() * 2) + 1;
            enemy.x = enemy.startx;
            enemy.magnitude = Math.random() * 60;
        }
    }
}
function updatePlayerBullets(){
    for(var i = 0; i < playerBulletgrp.getChildren().length; i++){
        //console.log(playerBulletgrp.getChildren()[i]);
        var bullet = playerBulletgrp.getChildren()[i];
        bullet.rotation += 0.5;

        if(bullet.x > config.width){
            bullet.destroy();
        }
    }
    //console.log("=================");
}

function updatePlayer(){
    if(keyup.isDown){
        player.setVelocityY(-player.speed);
    }else if(keydown.isDown){
        player.setVelocityY(player.speed);
    }
    else{
        player.setVelocityY(0);
    }
    if(KeyLeft.isDown){
        player.setVelocityX(-player.speed);
    }else if(keyRight.isDown){
        player.setVelocityX(player.speed);
    }else{
        player.setVelocityX(0);
    }

    if(player.y < 0 + (player.getBounds().height/2)){
        player.y = (player.getBounds().height/2);
    }else if(player.y > config.height - (player.getBounds().height/2)){
        player.y = config.height - (player.getBounds().height/2);
    }
    if(player.x < + (player.getBounds().width/2)){
        player.x = (player.getBounds().width/2);
    }else if(player.x > config.width - (player.getBounds().width/2)){
        player.x = config.width - (player.getBounds().width/2);
    }

    if(Phaser.Input.Keyboard.JustDown(keyFire)){
        fire();
    }
}

function fire(){
    var bullet = scene.physics.add.sprite(player.x + 50 , player.y + 10, "bullet");
    bullet.body.velocity.x = bulletSpeed;

    playerBulletgrp.add(bullet);
    //console.log(playerBulletgrp.getChildren);
}

function onUFOHIT(ufo, bullet){
    createExplosion(ufo.x, ufo.y);

    bullet.destroy();
    ufo.x = ufo.startx;
    ufo.speed = (Math.random() * 2) + 1;

}

function createExplosion(posX, posY){
    var explosion1 = scene.add.sprite(posX, posY, 'explosion1');
    explosion1.setScale(0.4);
    explosion1.rotation = Phaser.Math.Between(0, 360);

    var explosion2 = scene.add.sprite(posX, posY, 'explosion2');
    explosion2.setScale(0.2);
    explosion2.rotation = Phaser.Math.Between(0, 360);

    explosionGrp.add(explosion1);
    explosionGrp.add(explosion2);
}

function updateExplosion(){
    for(var i = explosionGrp.getChildren().length - 1; i >=0 ; i--){
        var explosion = explosionGrp.getChildren()[i];
        explosion.rotation += 0.04;
        explosion.scale += 0.02;
        explosion.alpha -= 0.05;
        if(explosion.alpha <= 0){
            explosion.destroy();
        }
    }
}


function ufoFire(enemy){
    if(running == true){
        var bullet = scene.physics.add.sprite(enemy.x, enemy.y, 'ufo_bullet');
        bullet.setScale(0.5);
        bullet.body.velocity.x = -bulletSpeed;

        ufoBulletGrp.add(bullet);
    }

}
function onPlayerHIT(player, obstacle){
   if(player.immortal == false){
        if(obstacle.texture.key == "ufo_bullet"){
            obstacle.destroy();
        }


        // decrease player's heart
        playerHeart--;
        if(playerHeart <= 0){
            playerHeart = 0;
            running = false;
            var me = scene.physics.add.sprite(config.width-750, config.height-100, 'me');
            me.setScale(1.5);
            

        }

        updatePlayerHeart();
        player.immortal = true;
        player.flickerTimer = scene.time.addEvent({
            delay: 100,
            callback: playerFlickering,
            repeat: 15
        });
    }
    
}

function createPlayerHeart(){
    for(var i = 0; i < playerHeart; i++){
        var heart = scene.add.sprite(40 + (i * 55), 40 ,'heart');
        heart.depth = 10;
        heartGrp.add(heart);
    }
}


function updatePlayerHeart(){
    for(var i = heartGrp.getChildren().length - 1;i >=0 ;i --){
        if(playerHeart < i+1){
            heartGrp.getChildren()[i].setVisible(false);
        }else{
            heartGrp.getChildren()[i].setVisible(true);
        }
    }
}

function playerFlickering(){
    player.setVisible(!player.visible);
    if(player.flickerTimer.repeatCount == 0){
        player.immortal = false;
        player.setVisible(true);
        player.flickerTimer.remove();
    }
    
}