'use strict';

var map;
var layer;
var dovah = require ('./Protagonista.js');
var prota;
var prota_Texture;
var meele_Texture;
var magic_Texture;
var cursor;
var meele_Button;
var magic_Button;
var magic_Interface;
var stamina_Interface;

    var BootScene = {
        preload: function () {
        // load here assets required for the loading screen
        cursor = this.game.input.keyboard.createCursorKeys();
        meele_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        magic_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.game.load.image('preloader_bar', 'images/preloader_bar.png');
        this.game.load.image('Tittle', 'images/Titulos-Arte/titulo.png');
        this.game.load.image('Play', 'images/Titulos-Arte/PLAY.png');
        this.game.load.image('Decoración','images/Titulos-Arte/Decoración.png');
        this.game.load.audio('Menu_Music', 'audio/Skyrim-8-Bit-Theme.ogg');
        this.game.load.audio('Game_Music', 'audio/08 - Overworld.ogg');
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
            this.music_menu.play();
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
    
        // TODO: load here the assets for the game
        this.game.load.tilemap('map1', 'images/Mapa3.json',null,Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tileset', 'images/PVLI3.tsx');
        this.game.load.spritesheet('Magic_Interface','images/interfaz/Mana/Mana.png',32,32);
        this.game.load.spritesheet('Stamina_Interface','images/interfaz/Stamina/Stamina.png',32,32);
        this.game.load.spritesheet('Dovah', 'images/Dovah/SpriteDovah.png', 62, 60);
        this.game.load.spritesheet('Magic', 'images/Dovah/Magic/Magic.png', 30, 30);
        this.game.load.spritesheet('Meele', 'images/Dovah/Meele/Attack.png', 55, 42);
        },
        create: function () {
            this.game.state.start('play');
        }
    };

    var PlayScene = {
    preload: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = this.game.add.tilemap('map1',16,16);

        map.addTilesetImage('tileset');

        layer = map.createLayer("Suelo");
        layer1 = map.createLayer("Muros");

        map.setCollisionBetween(1,10000,true,layer1);

        this.music_game = this.game.add.audio('Game_Music');
        this.music_game.play();

        prota_Texture = this.game.add.sprite( 100 , 100, 'Dovah');
        prota_Texture.smoothed = false;
        prota_Texture.scale.set(1.25);
        meele_Texture = this.game.add.sprite( -100 , -100, 'Meele');
        meele_Texture.smoothed = false;
        meele_Texture.scale.set(1.25);
        magic_Texture = this.game.add.sprite( -100 , -100, 'Magic');
        magic_Texture.smoothed = false;
        magic_Texture.scale.set(2);
        prota = new dovah(prota_Texture,meele_Texture,magic_Texture, this.game);
        game.physics.arcade.enable(prota);
        this.game.camera.follow(prota_Texture);
        
        magic_Interface = this.game.add.sprite(40, 490, 'Magic_Interface');
        magic_Interface.smoothed = false;
        magic_Interface.scale.set(5);
        magic_Interface.fixedToCamera = true;
        stamina_Interface = this.game.add.sprite(600, 490,'Stamina_Interface');
        stamina_Interface.smoothed = false;
        stamina_Interface.scale.set(5);
        stamina_Interface.fixedToCamera = true;
        layer.smoothed = false;
        layer.scale.set(5);

        layer.resizeWorld();

    },
    update: function()
    {
        game.physics.arcade.collide(layer1,prota);
        prota_Texture.body.velocity.set(0);
        if(cursor.left.isDown) prota.move(3);
        else if(cursor.right.isDown) prota.move(4);
        else if(cursor.up.isDown) prota.move(1);
        else if(cursor.down.isDown) prota.move(2);
        else prota.stop();

        if(meele_Button.isDown) prota.attack_Meele();
        else prota.stop_Meele();

        if(magic_Button.isDown) prota.attack_Magic();
    } 
    };

window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
  
    game.state.add('boot', BootScene);
    game.state.add('menu', Menu);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);
  
    game.state.start('boot');
  };