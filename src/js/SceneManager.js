'use strict';

var map;
var layer;
const gameManager = require ('./GameManager.js');
var dovah = require ('./Protagonista.js');
var enemy = require ('./Enemigo.js');
var ronda_Actual = 0;
var mapa_Actual = 0;
var ronda = [1 + mapa_Actual * 2];
var prota;
var prota_Texture;
var meele_Texture;
var magic_Texture;
var cursor;
var meele_Button;
var magic_Button;
var thuum_Button;
var level_UP_Button;
var restart_Button;
var magic_Interface;
var stamina_Interface;
var health_Interface;
var thuum_Interface;
var util = true;
var fin = false;
var maps = ['tundra', 'desierto', 'bosque', 'biblioteca'];
var this_Game_Maps = [];
var enemiesTotal = 0;
var enemiesAlive = 0;
var reset = false; //True reseteo ejecutado
var music_game;
var first_Game = true;
    var BootScene = {
        preload: function () {
        // load here assets required for the loading screen
        for (var i = 0; i < maps.length; i++)
        {
            this_Game_Maps[i] = Math.floor(Math.random() * maps.length)
            var same_Number = true;
            var z = 1;
            while(same_Number && i < 0)
            {
                if(this_Game_Maps[i] == this_Game_Maps[i-z])
                {
                    i--;
                    same_Number = false;
                } 
                else z++;
                if(i-z < 0) same_Number = false;
            }
        }
        cursor = this.game.input.keyboard.createCursorKeys();
        meele_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        magic_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        thuum_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
        level_UP_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.V);
        restart_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.game.load.image('preloader_bar', 'images/preloader_bar.png');
        this.game.load.image('Tittle', 'images/Titulos-Arte/titulo.png');
        this.game.load.image('Play', 'images/Titulos-Arte/PLAY.png');
        this.game.load.image('Decoración','images/Titulos-Arte/Decoración.png');
        this.game.load.audio('Menu_Music', 'audio/Skyrim-8-Bit-Theme.ogg');
        },
    
        create: function () {
        this.game.state.start('menu');
        }
    };
    var Menu = {
        preload: function (){
            this.music_menu = this.game.add.audio('Menu_Music');
            this.game.add.image(0, 0, 'Tittle');
            this.game.add.image(370, 250, 'Decoración');
            this.play = this.game.add.button(-90, 150, 'Play', Play, this, 2, 1, 0);
            this.play.input.useHandCursor = true;
            this.play.smoothed = false;
            this.play.scale.set(0.75);
            this.music_menu.loopFull(1);
        }
    } 
    function Play()
    {
        this.music_menu.stop();
        this.game.state.start('preloader');
    }
    var PreloaderScene = {
        preload: function () {

        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // TODO: load here the assets for the game
        this.game.load.audio('Game_Music', 'audio/'+ maps[this_Game_Maps[mapa_Actual]] +'.ogg');
        this.game.load.tilemap('map1', 'images/'+ maps[this_Game_Maps[mapa_Actual]] +'.csv', null, Phaser.Tilemap.TILED_CSV);
        this.game.load.image('tileset', 'images/tileset.png');
        this.game.load.spritesheet('snow', 'images/snow.png', 240, 180);
        this.game.load.image('GameOver', 'images/interfaz/Títulos/GameOver.png');
        this.game.load.image('RoundClear', 'images/interfaz/Títulos/Round_Clear.png');
        this.game.load.spritesheet('Thu-um_Screen', 'images/interfaz/Thu-um/thuum_screen.png', 800, 569);
        this.game.load.spritesheet('Thu-um_Interface','images/interfaz/Thu-um/thu-um.png',32,32);
        this.game.load.spritesheet('Health_Interface','images/interfaz/Vida/Vida.png',32,32);
        this.game.load.spritesheet('Magic_Interface','images/interfaz/Mana/Mana.png',32,32);
        this.game.load.spritesheet('Stamina_Interface','images/interfaz/Stamina/Stamina.png',32,32);
        this.game.load.spritesheet('Dovah', 'images/Dovah/SpriteDovah.png', 62, 60);
        this.game.load.spritesheet('Magic', 'images/Dovah/Magic/Magic.png', 30, 30);
        this.game.load.spritesheet('Meele', 'images/Dovah/Meele/Attack.png', 55, 42);
        this.game.load.spritesheet('Level_UP', 'images/Interfaz/Level_UP/level_UP.png', 32, 32);
        this.game.load.image('Level_UP_Screen', 'images/Interfaz/Level_UP/Level_Up_Screen.png');
        this.game.load.image('Magic_UP_Button', 'images/Interfaz/Level_UP/Magic_Button.png');
        this.game.load.image('Melee_UP_Button', 'images/Interfaz/Level_UP/Melee_Button.png');
        this.game.load.image('Thuum_UP_Button', 'images/Interfaz/Level_UP/Thuum_Button.png');
        this.enemy_Texture = this.game.load.spritesheet('Dragon', 'images/Enemigos/Enemigos.png',60,60);
        },
        create: function () {
            this.game.state.start('play');
        }
    };

    var PlayScene = {
    preload: function () {
        this.timer = this.game.time.create(false);
      //  this.game.camera.scale.setTo(4);

        map = this.game.add.tilemap('map1',64,64);

        map.addTilesetImage('tileset');

        map.setCollision( [72, 73, 74, 75, 88, 89, 90, 91, 
                        177, 178, 209, 210, 229, 194, 192, 
                        195, 179, 208, 180, 358, 359, 360,
                        361, 374, 375, 380, 390, 391, 406,
                        407, 168, 169, 182, 183, 464, 480,
                        481, 466, 450, 466, 499, 453, 454,
                        457, 485, 486, 490, 491, 167, 499,
                        468, 473, 482, 166] );

        layer = map.createLayer(0);

        music_game = this.game.add.audio('Game_Music');
        music_game.loopFull(1);

        prota_Texture = this.game.add.sprite( 300 , 450, 'Dovah');
        prota_Texture.smoothed = false;
        prota_Texture.scale.set(1.25);
        this.game.physics.enable(prota_Texture, Phaser.Physics.ARCADE);
        prota_Texture.body.collideWorldBounds = true;
        prota_Texture.body.setSize(40, 10, 10, 45);
        this.UP = this.game.add.sprite(160, 490, 'Level_UP');
        this.UP.smoothed = false;
        this.UP.scale.y = 4;
        this.UP.scale.x = 5;
        this.UP.animations.add('UP', [0,1,2,3,4,5], 5, true);
        this.UP.play('UP');
        this.UP.visible = false;
        this.snow = this.game.add.sprite(0, 0, 'snow');
        if(maps[this_Game_Maps[mapa_Actual]] == 'tundra') this.snow.visible = true;
        else this.snow.visible = false;
        this.snow.scale.set(3.33);
        this.snow.fixedToCamera = true;
        this.snow.animations.add('snowing');
        console.log(maps[this_Game_Maps[mapa_Actual]]);
        this.snow.animations.play('snowing', 5, true);
        this.meele_Group = this.game.add.group();
        this.meele_Group.enableBody = true;
        this.meele_Group.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 20; i++)
        {
            var m = this.meele_Group.create(0, 0, 'Meele');
            m.name = 'Meele' + i;
            m.exists = false;
            m.visible = false;
            m.smoothed = false;
            m.scale.set(1.25);
        }
        this.meele_Group.callAll('animations.add', 'animations', 'attack', [1,2,3,4,5], 7, true);
        this.meele_Group.callAll('animations.play', 'animations', 'attack');

        this.magic_Group = this.game.add.group();
        this.magic_Group.enableBody = true;
        this.magic_Group.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 30; i++)
        {
            var b = this.magic_Group.create(0, 0, 'Magic');
            b.name = 'Magic' + i;
            b.exists = false;
            b.visible = false;
            b.smoothed = false;
            b.scale.y = 2;
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(resetFire, this);
        }
        this.magic_Group.callAll('animations.add', 'animations', 'bullet', [0, 1, 2, 3, 4, 5], 5, true);
        this.magic_Group.callAll('animations.play', 'animations', 'bullet');

        prota = new dovah(prota_Texture, this.meele_Group, this.magic_Group, this.game, this.UP);
        this.game.camera.follow(prota_Texture);

        this.enemies = [];
        enemiesTotal = ronda[ronda_Actual];
        enemiesAlive = ronda[ronda_Actual];
        for (var i = 0; i < enemiesTotal; i++)
        {
             this.enemies[i] = new enemy(i, this.enemy_Texture, this.game);
        }

        this.thuum_Screen = this.game.add.sprite(0, 0, 'Thu-um_Screen');
        this.thuum_Screen.visible = false;
        this.thuum_Screen.scale.y = 1.1;
        this.thuum_Screen.fixedToCamera = true;
        this.thuum_Screen.animations.add('FUSH_RO_DAH', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], 7, true);
        thuum_Interface = this.game.add.sprite(320, -60, 'Thu-um_Interface');
        this.t = 5;
        thuum_Interface.smoothed = false;
        thuum_Interface.scale.set(5);
        thuum_Interface.fixedToCamera = true;
        health_Interface = this.game.add.sprite(320, 490, 'Health_Interface');
        this.h = 1;
        health_Interface.smoothed = false;
        health_Interface.scale.set(5);
        health_Interface.fixedToCamera = true;
        magic_Interface = this.game.add.sprite(40, 490, 'Magic_Interface');
        this.m = 1;
        magic_Interface.smoothed = false;
        magic_Interface.scale.set(5);
        magic_Interface.fixedToCamera = true;
        stamina_Interface = this.game.add.sprite(600, 490,'Stamina_Interface');
        this.s = 1;
        stamina_Interface.smoothed = false;
        stamina_Interface.scale.set(5);
        stamina_Interface.fixedToCamera = true;
        layer.smoothed = false;
        //layer.scale.set(3); 

        this.GameOver = this.game.add.sprite( 0 , 0, 'GameOver');
        this.GameOver.visible = false;
        this.GameOver.fixedToCamera = true;
        this.round_Clear = this.game.add.sprite(0, 0, 'RoundClear');
        this.round_Clear.visible = false;
        this.round_Clear.fixedToCamera = true;
        if(first_Game)
        {
            this.level_UP_Screen = this.game.add.sprite( 0 , 0, 'Level_UP_Screen');
            this.level_UP_Screen.smoothed = false;
            this.level_UP_Screen.scale.set(1.335);
            this.level_UP_Screen.visible = false;
            this.level_UP_Screen.fixedToCamera = true;
            this.levels = 6;
            this.magic_UP = [];
            for(var i = 0; i < this.levels; i++)
            {
                this.magic_UP[i] = this.game.add.sprite( 2, 80*i, 'Magic_Interface');
                this.magic_UP[i].smoothed = false;
                this.magic_UP[i].scale.set(8);
                this.magic_UP[i].fixedToCamera = true;
                this.magic_UP[i].animations.add('UP_Magic', [9], 5, true);
                this.magic_UP[i].animations.add('Used', [0], 5, true);
                this.magic_UP[i].play('UP_Magic');
                this.magic_UP[i].visible = false;
            }
            this.magic_UP_Button = this.game.add.button(24, 30, 'Magic_UP_Button', magic_UP_Click, this, 2, 1, 0);
            this.magic_UP_Button.fixedToCamera = true;
            this.magic_UP_Button.input.useHandCursor = true;
            this.magic_UP_Button.smoothed = false;
            this.magic_UP_Button.scale.set(1.2);
            this.magic_UP_Button.visible = false;
            this.thuum_UP = [];
            for(var i = 0; i < this.levels; i++)
            {
                this.thuum_UP[i] = this.game.add.sprite( 272, 80*i, 'Thu-um_Interface');
                this.thuum_UP[i].smoothed = false;
                this.thuum_UP[i].scale.set(8);
                this.thuum_UP[i].fixedToCamera = true;
                this.thuum_UP[i].animations.add('UP_Thuum', [0], 5, true);
                this.thuum_UP[i].animations.add('Used', [7], 5, true);
                this.thuum_UP[i].play('UP_Thuum');
                this.thuum_UP[i].visible = false;
            }
            this.thuum_UP_Button = this.game.add.button(280, 30, 'Thuum_UP_Button', thuum_UP_Click, this, 2, 1, 0);
            this.thuum_UP_Button.fixedToCamera = true;
            this.thuum_UP_Button.input.useHandCursor = true;
            this.thuum_UP_Button.smoothed = false;
            this.thuum_UP_Button.scale.set(1.2);
            this.thuum_UP_Button.visible = false;
            this.melee_UP = [];
            for(var i = 0; i < this.levels; i++)
            {
                this.melee_UP[i] = this.game.add.sprite( 542, 80*i, 'Stamina_Interface');
                this.melee_UP[i].smoothed = false;
                this.melee_UP[i].scale.set(8);
                this.melee_UP[i].fixedToCamera = true;
                this.melee_UP[i].animations.add('UP_Melee', [9], 5, true);
                this.melee_UP[i].animations.add('Used', [0], 5, true);
                this.melee_UP[i].play('UP_Melee');
                this.melee_UP[i].visible = false;
            }
            this.melee_UP_Button = this.game.add.button(562 , 30, 'Melee_UP_Button', melee_UP_Click, this, 2, 1, 0);
            this.melee_UP_Button.fixedToCamera = true;
            this.melee_UP_Button.input.useHandCursor = true;
            this.melee_UP_Button.smoothed = false;
            this.melee_UP_Button.scale.set(1.2);
            this.melee_UP_Button.visible = false;
            this.game.time.advancedTiming = true;
            first_Game = false;
        }
        layer.resizeWorld();
    },
    update: function()
    {
        if(!fin)
        {
            this.UP.x = prota.dovah.x -40;
            this.UP.y = prota.dovah.y - 10;
            this.game.physics.arcade.collide(prota_Texture, layer);
            if(gameManager.Stamina() > 0)this.s = Math.abs(gameManager.Stamina() - 10);
            if(gameManager.Magic() > 0)this.m = Math.abs(gameManager.Magic() - 10);
            if(gameManager.Life() > 0)this.h = Math.abs(gameManager.Life() - 10);
            if(gameManager.Thuum() > 2)this.t = Math.abs(gameManager.Thuum() - 10);
            magic_Button.onDown.add(magic, this);
            magic_Interface.animations.add('Use_Magic', [this.m], 5, true);
            magic_Interface.play('Use_Magic');
            this.game.world.bringToTop(magic_Interface);
            meele_Button.onDown.add(stamina, this);
            stamina_Interface.animations.add('Use_Stamina', [this.s], 5, true);
            stamina_Interface.play('Use_Stamina');
            this.game.world.bringToTop(stamina_Interface);
            health_Interface.animations.add('Use_Health', [this.h], 5, true);
            health_Interface.play('Use_Health');
            this.game.world.bringToTop(health_Interface);
            thuum_Button.onDown.add(thuum, this);
            thuum_Interface.animations.add('Use_thuum', [this.t], 5, true);
            thuum_Interface.play('Use_thuum');
            this.game.world.bringToTop(thuum_Interface);
            level_UP_Button.onDown.add(level_UP, this);
            prota_Texture.body.velocity.set(0);
            if(cursor.left.isDown) prota.move(3);
            else if(cursor.right.isDown) prota.move(4);
            else if(cursor.up.isDown) prota.move(1);
            else if(cursor.down.isDown) prota.move(2);
            else prota.stop();
            for (var i = 0; i < this.enemies.length; i++)
            {
                if(util) enemiesAlive = 0;
                if (this.enemies[i].alive)
                {
                    util = false;
                    this.actual_Enemy = this.enemies[i];
                    if(!this.enemies[i].fly)
                    {
                        for(var o = i + 1; o < this.enemies.length; o++)
                        {
                            this.game.physics.arcade.collide(this.enemies[i].enemy, this.enemies[o].enemy);
                            this.game.physics.arcade.collide(this.enemies[o].enemy, this.enemies[i].enemy);
                        }
                    }
                    enemiesAlive++;
                    if((Math.abs(prota.dovah.x  - this.enemies[i].enemy.x) < 50) && (Math.abs(prota.dovah.y  - this.enemies[i].enemy.y) < 50))
                    {
                        if((this.enemies[i].enemy.y > prota.dovah.y) || this.enemies[i].fly) this.game.world.bringToTop(this.enemies[i].enemy);
                        else this.game.world.bringToTop(prota.dovah);
                    }
                    this.game.physics.arcade.collide(prota.dovah, this.enemies[i].enemy, enemy_Hit, null, this);
                    if(!this.enemies[i].fly) this.game.physics.arcade.collide(prota.attack, this.enemies[i].enemy, meele_Hit, null, this);
                    this.game.physics.arcade.overlap(prota.bullet, this.enemies[i].enemy, magic_Hit, null, this);
                    if(!this.enemies[i].fly) this.game.physics.arcade.collide(this.enemies[i].enemy, layer);
                    this.enemies[i].update(prota_Texture);
                }
            }
            util = true;
            if(enemiesAlive <= 0 && !reset)
            {
                this.timer.add(2000, next, this);
                reset = true;
                this.round_Clear.visible = true;
                this.game.world.bringToTop(this.round_Clear);
                this.timer.start();
                function next() 
                { 
                    reset = false;
                    ronda_Actual++;
                    this.round_Clear.visible = false;
                    if(ronda_Actual >= ronda.length)
                    {
                        music_game.stop();
                        ronda_Actual = 0;
                        mapa_Actual++;
                        this.game.state.start('preloader');
                    }
                    else
                    {
                        enemiesTotal = ronda[ronda_Actual];
                        enemiesAlive = ronda[ronda_Actual];
                        for (var i = 0; i < enemiesTotal; i++)
                        {
                             this.enemies[i] = new enemy(i, this.enemy_Texture, this.game);
                        }
                    }
                }
                
            }
            this.game.world.bringToTop(this.snow);
            if(this.level_UP_Screen.visible)
            {
                this.game.world.bringToTop(this.level_UP_Screen);
                for(var i = 0; i < this.levels; i++)
                {
                    this.game.world.bringToTop(this.magic_UP[i]);
                    this.game.world.bringToTop(this.melee_UP[i]);
                    this.game.world.bringToTop(this.thuum_UP[i]);
                }
                this.game.world.bringToTop(this.magic_UP_Button);
                this.game.world.bringToTop(this.melee_UP_Button);
                this.game.world.bringToTop(this.thuum_UP_Button);
            } 
        }
        else 
        {
            restart_Button.onDown.add(restart, this);
        }
    } 
    };
    function stamina ()
    {
        prota.attack_Meele();
    }

    function magic ()
    {
        prota.attack_Magic();
    }
    function thuum()
    {
        if(gameManager.Thuum() <= 2)
        {
            this.timer.add(3000, stop, this);
            this.thuum_Screen.visible = true;
            this.game.world.bringToTop(this.thuum_Screen);
            this.thuum_Screen.play('FUSH_RO_DAH');
            for (var i = 0; i < this.enemies.length; i++)
            {
                this.enemies[i].relax();
            }
            gameManager.Use_Thuum();
            this.timer.start();
            function stop()
            {
                this.thuum_Screen.visible = false;
                this.thuum_Screen.animations.stop();
                this.timer.add(1000, kill, this);
                this.timer.start();
                this.game.camera.shake(0.025, 1000);
                function kill()
                {
                    for (var i = 0; i < this.enemies.length; i++)
                    {
                       if(!this.enemies[i].fly) this.enemies[i].hit(999, prota);
                       else 
                       {
                           this.enemies[i].chains();
                           this.enemies[i].move();
                       }
                    }
                }
            }
        }
    }
    function level_UP()
    {
        if(this.level_UP_Screen.visible)
        {
            this.level_UP_Screen.visible = false;
            for(var i = 0; i < this.levels; i++)
            {
                this.magic_UP[i].visible = false;
                this.melee_UP[i].visible = false;
                this.thuum_UP[i].visible = false;
            }
            this.magic_UP_Button.visible = false;
            this.melee_UP_Button.visible = false;
            this.thuum_UP_Button.visible = false;
        }
        else 
        {
            this.level_UP_Screen.visible = true;
            for(var i = 0; i < this.levels; i++)
            {
                this.magic_UP[i].visible = true;
                this.melee_UP[i].visible = true;
                this.thuum_UP[i].visible = true;
            }
            this.magic_UP_Button.visible = true;
            this.melee_UP_Button.visible = true;
            this.thuum_UP_Button.visible = true;
        }
    }
    function magic_UP_Click()
    {
        if(gameManager.New_Skill() && prota.magic_Level < this.levels)
        {
            this.magic_UP[prota.magic_Level].play('Used');
            gameManager.Use_Skill_Point();
            if(prota.magic_Level % 2 == 0)
            {
                prota.magic_UP(0,1,0);
            }
            else
            {
                prota.magic_UP(1,1,1);
            }
        }
    }
    function melee_UP_Click()
    {
        if(gameManager.New_Skill() && prota.melee_Level < this.levels)
        {
            this.melee_UP[prota.melee_Level].play('Used');
            gameManager.Use_Skill_Point();
            if(prota.melee_Level % 2 == 0)
            {
                prota.melee_UP(0,1,0);
            }
            else
            {
                prota.melee_UP(1,1,1);
            }
        }
    }
    function thuum_UP_Click()
    {
        if(gameManager.New_Skill() && prota.thuum_Level < this.levels)
        {
            this.thuum_UP[prota.thuum_Level].play('Used');
            gameManager.Use_Skill_Point();
            prota.thuum_UP(1);
        }
    }
    function enemy_Hit ()
    {
        prota.hit();
        health_Interface.play('Use_Health');
        console.log(gameManager.Life());
        if(gameManager.Life() < 0)
        {
            this.GameOver.visible = true;
            this.game.world.bringToTop(this.GameOver);
            fin = true;
        }
    }
    function meele_Hit ()
    {
      this.actual_Enemy.hit(prota.melee_Damage, prota);
    }
    function magic_Hit ()
    {
        prota.bullet.kill();
        this.actual_Enemy.hit(prota.magic_Damage, prota);
    }
    function restart()
    {
        fin = false;
        gameManager.Restart();
        this.game.state.start('menu');
    }
    function resetFire(fire)
    {
        fire.kill();
    }
window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
  
    game.state.add('boot', BootScene);
    game.state.add('menu', Menu);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);
  
    game.state.start('boot');
  };