class Skins extends Phaser.Scene {
    constructor() {
        super("Skins");
    }

    create() {
        let ancho = this.scale.width;
        let alto = this.scale.height;

        this.add.image(ancho / 2, alto / 2, "fondo_inicio").setDisplaySize(ancho, alto).setAlpha(0.5);
        this.add.text(ancho / 2, 80, "SELECCIONA TU PERSONAJE", { 
            fontSize: "40px", 
            fill: "#fff", 
            fontFamily: "Ceviche One"
        }).setOrigin(0.5);

        // Configuración de posiciones para 3 skins
        const yPos = alto / 2;
        const spacing = ancho / 4; // Divide la pantalla en 4 partes para centrar 3 objetos

        // --- SKIN 1 (La nueva) ---
        this.crearBotonSkin(spacing * 1, yPos, "skin1", "Gavv",  "click1");

        // --- SKIN 2 (Zeztz) ---
        this.crearBotonSkin(spacing * 2, yPos, "skin2", "Zeztz", "click2");

        // --- SKIN 3 (Decade) ---
        this.crearBotonSkin(spacing * 3, yPos, "skin3", "Decade", "click3");

        // Botón para volver 
        let botonVolver = this.add.text(ancho / 2, alto - 50, "Volver al Menú", {
            fontSize: "30px",
            fill: "#ff0000",
            fontFamily: "Ceviche One"
        }).setOrigin(0.5).setInteractive();
        
        botonVolver.on("pointerdown", () => this.scene.start("Inicio"));
    }

    // Función auxiliar para no repetir código de botones
    crearBotonSkin(x, y, key, nombre, sonido) {
    let skinImg = this.add.image(x, y, key).setInteractive().setScale(2);
    this.add.text(x, y + 70, nombre, { fontSize: "40px", fill: "#ffffff", fontFamily: "Ceviche One"}).setOrigin(0.5);

    skinImg.on("pointerover", () => skinImg.setTint(0xcc9f4b));
    skinImg.on("pointerout", () => skinImg.clearTint());

    skinImg.on("pointerdown", () => {
        this.sound.play(sonido, { volume: 0.5 }); // usa el sonido de ese skin

        this.registry.set("skinSeleccionada", key);

        this.time.delayedCall(150, () => {
            this.scene.start("Inicio");
        });
      });
    }
 
}