class Inicio extends Phaser.Scene {

    constructor(){
        super("Inicio");
    }

    create(){

        let ancho = this.scale.width;
        let alto = this.scale.height;

        // Fondo con imagen
        let fondo = this.add.image(ancho/2, alto/2, "fondo_inicio");

        // Ajustar a pantalla
        fondo.setDisplaySize(ancho, alto);

        // (Opcional) bajar un poco brillo para que el texto resalte
        fondo.setAlpha(0.8);

        // Título
        let titulo = this.add.text(ancho/2, alto/2 - 100, "GOCHIZOS STRIKE", {
            fontSize: "60px",
            fill: "#fffdfd",
            fontFamily: "Ceviche One"
        }).setOrigin(0.5);

        // Animación del título
        this.tweens.add({
            targets: titulo,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Botón jugar
        let boton = this.add.text(ancho/2, alto/2, "Play", {
            fontSize: "32px",
            fill: "#ffffff",
            fontFamily: "Ceviche One",
            backgroundColor: "#cc9f4bd2",
            padding: { x: 20, y: 10 }           
        })
        .setOrigin(0.5)
        .setInteractive();

        // Botón Skins
       let botonSkins = this.add.text(ancho/2, alto/2 + 180, "Cambiar Skin", {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Ceviche One",
        backgroundColor: "#4b8fcc",
        padding: { x: 15, y: 8 }           
        })
        .setOrigin(0.5)
        .setInteractive();

      botonSkins.on("pointerdown", () => {
        this.scene.start("Skins");
       });

        // Hover
        boton.on("pointerover", () => boton.setScale(1.1));
        boton.on("pointerout", () => boton.setScale(1));

        // Iniciar juego
        boton.on("pointerdown", () => {
            this.scene.start("Juego");
        });

        // Instrucciones
        this.add.text(ancho/2, alto/2 + 80,
            "Toca la pantalla o presiona espacio para saltar",
            { fontSize: "40px", fill: "#ffffff", fontFamily: "Ceviche One"}
        ).setOrigin(0.5);
    }
}