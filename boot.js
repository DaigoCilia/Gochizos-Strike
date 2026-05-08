class Boot extends Phaser.Scene {

    constructor(){
        super("Boot");
    }

    preload(){
        // Solo cargamos el logo
        this.load.image("logo", "logo.png");
    }

    create(){
        this.scene.start("Carga");
    }
}
