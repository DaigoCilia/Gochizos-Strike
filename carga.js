class Carga extends Phaser.Scene {

    constructor(){
        super("Carga");
    }

    preload(){

        let ancho = this.scale.width;
        let alto = this.scale.height;

        // Logo
        let logo = this.add.image(ancho/2, alto/2 - 150, "logo");
        logo.setScale(0.3);

        // Texto
        let texto = this.add.text(ancho/2, alto/2 - 60, "Cargando...", {
            fontSize: "30px",
            fill: "#ffffff",
            fontFamily: "Ceviche One"
        }).setOrigin(0.5);

        // Barra fondo
        let barraFondo = this.add.rectangle(ancho/2, alto/2, 300, 30, 0xffffff, 0.3);

        // Barra progreso
        let barra = this.add.rectangle(ancho/2 - 150, alto/2, 0, 30, 0xffffff).setOrigin(0, 0.5);

        this.load.on("progress", (value) => {
          barra.width = 300 * value;
    
           // Cambia de rojo a verde según progresa
           const red = Math.floor(255 * (1 - value)); //Esta línea se encarga de que el Rojo empiece al máximo y desaparezca poco a poco
           const green = Math.floor(255 * value); //Esta hace lo contrario, hace que el Verde aparezca de la nada.
           barra.setFillStyle(Phaser.Display.Color.GetColor(red, green, 100));
        });

        // Assets del juego
        this.load.image("fondo", "Fondo.png");
        this.load.image("skin1", "Gochizo_Sprite.png");
        this.load.image("skin2", "Zeztz.png");
        this.load.image("skin3", "Decade.png");
        this.load.image("rider", "Moto.png");
        this.load.image("belt", "Belt.png");
        this.load.image("spike", "Spike.png");
        this.load.image("suelo", "platform.png");
        this.load.image("estela", "particulafuego.png");

        this.load.image("fondo_inicio", "fondo_inicio.png");
        
        this.load.audio("click1", "Audio1.mp3");
        this.load.audio("click2", "Audio2.mp3");
        this.load.audio("click3", "Audio3.mp3");
        this.load.audio("musica", "EATME.mp3");

        // Simular carga
        for(let i = 0; i < 30; i++){
            this.load.image("fake" + i, "Gochizo_Sprite.png");
        }
        // Nos ayuda a que la barra no carga instantaneamente
        // Nos da mas tiempo de mostrar animaciones/logo
    }

    create(){
        this.time.delayedCall(1000, () => {
            this.scene.start("Inicio");
        });
    }
}
