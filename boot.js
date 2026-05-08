class Boot extends Phaser.Scene {

    constructor(){
        super("Boot");
    }

    preload(){
        // Solo cargamos el logo
        this.load.image("logo", "assets/logo.png");
    }

    create(){
        this.scene.start("Carga");
    }
}