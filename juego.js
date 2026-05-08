class Juego extends Phaser.Scene {
    constructor() {
        super("Juego");
    }

    // 1. Recibir datos de intentos al reiniciar
    init(data) {
        this.intentos = data.intentos || 1;
    }

    create() {
        let ancho = this.scale.width;
        let alto = this.scale.height;

        // CONFIGURACIÓN DE VELOCIDAD GLOBAL
        this.velocidad = 250; 

        // FONDO 
        this.fondo = this.add.tileSprite(0, 0, ancho, alto, "fondo")
        .setOrigin(0, 0)
        .setScrollFactor(0);
        let escalaX = ancho / this.textures.get("fondo").getSourceImage().width;
        let escalaY = alto / this.textures.get("fondo").getSourceImage().height;
        this.fondo.setTileScale(escalaX, escalaY);

        // MÚSICA Y BPM
        this.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
        this.musica.play();
        this.bpm = 120;
        this.beatTiempo = (60 / this.bpm) * 1000;

        // TEXTO DE INTENTOS
        this.textoAttempt = this.add.text(
            ancho / 2,
            alto / 2,
            "ATTEMPT " + this.intentos,
            {
                fontSize: "64px",
                fill: "#ffffff",
                fontFamily: "Ceviche One",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5).setScrollFactor(0);

        this.textoAttempt.setAlpha(0);

        this.tweens.add({
            targets: this.textoAttempt,
            alpha: 1,
            duration: 200,
            yoyo: true,
            hold: 600,
            ease: "Power2"
        });

         // ===== MUNDO =====
        this.physics.world.setBounds(0, 0, 10000, alto);
        this.cameras.main.setBounds(0, 0, 10000, alto); //nueva linea

        // SUELO
        this.suelo = this.physics.add.staticGroup();
        this.suelo.create(5000, alto - 20, "suelo")
        .setDisplaySize(10000, 40).refreshBody()
        .refreshBody();

        // JUGADOR (Posición fija en X: 150)
        // JUGADOR: Busca la skin en el registro, si no hay ninguna, usa "skin1" por defecto
        let skinActual = this.registry.get("skinSeleccionada") || "skin1"; 
        this.jugador = this.physics.add.sprite(150, alto - 100, skinActual);
        this.jugador.setDisplaySize(40, 40);
        this.jugador.setGravityY(1300); 
        this.jugador.setCollideWorldBounds(true);
        this.jugador.setPushable(false); //nueva

        this.physics.add.collider(this.jugador, this.suelo);

        // estela
        // Colores de estela por skin (después de crear al jugador)
        this.coloresSkin = {
        "skin1": 0x800080, // Gavv
        "skin2": 0x20603d, // Zeztz
        "skin3": 0xcf3476, // Decade
       };

       //Particulas
       let colorEstela = this.coloresSkin[skinActual] || 0xffffff;
this.estela = this.add.particles(0, 0, 'estela', {
      
    quantity: 3,
    frequency: 20,
    lifespan: 400,

    scale:  { start: 1, end: 0 },      // empieza a tamaño completo
    alpha:  { start: 0.8, end: 0 },

    tint: colorEstela,
    blendMode: 'ADD',

    speedX: { min: -80, max: -20 },
    speedY: { min: -10, max: 10 },
});
this.estela.startFollow(this.jugador, -18, 0);


         // ===== CÁMARA =====
        this.cameras.main.setScroll(0, 0); //nueva linea

        // GRUPOS
        this.spikes = this.physics.add.group();
        this.bloques = this.physics.add.staticGroup(); // Para plataformas

        //Item 
       this.belts = this.physics.add.group();
       this.enPowerUp = false;

       // Overlap para recoger el belt
       this.physics.add.overlap(this.jugador, this.belts, this.activarPowerUp, null, this);

       this.beltCount = 0; // contador de apariciones
       this.maxBelts = 6;  // máximo de veces que aparece


       // Spawner del belt - aparece cada cierto tiempo
       this.time.delayedCall(20000, () => {
       this.crearBelt(); // primera aparición a los 20 segundos

       // después de la primera, sigue apareciendo cada 10 segundos
        this.time.addEvent({
            delay: 18000, // cada 18 segundos
            callback: () => {
            if (this.beltCount < this.maxBelts) {
                this.crearBelt();
            }
        },
          callbackScope: this,
          loop: true
          });
       });

        // COLISIONES
        this.physics.add.overlap(this.jugador, this.spikes, this.morir, null, this);
        this.physics.add.collider(this.jugador, this.bloques);

        this.nivelTerminado = false;

    this.patron = [
    // === INTRO (beats 1-20) - más larga y tranquila ===
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },

    // === SECCIÓN A (beats 21-60) - muy tranquilo, spikes aislados ===
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "doble_spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },

    // === SECCIÓN B (beats 61-120) - sube un poco, pero respira ===
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "doble_spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "doble_spike" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "spike" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "doble_spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "doble_spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },

    // === SECCIÓN C (beats 121-180) - clímax moderado ===
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "doble_spike" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "doble_spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "doble_spike" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "doble_spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "spike" },
    { tipo: "vacio" }, { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "doble_spike" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "doble_spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "doble_spike" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "spike" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },

    // === FINAL (beats 181-220) - bajada suave ===
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "bloque", altura: 100 }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "spike" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" },
    { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "vacio" }, { tipo: "fin" }, // ← beat 220
    ];
   this.indicePatron = 0;

        // GENERADOR SINCRONIZADO AL BPM
        this.time.addEvent({
            delay: this.beatTiempo,
            callback: this.ejecutarPatron,
            callbackScope: this,
            loop: true
        });

        // CONTROLES
        this.input.keyboard.on("keydown-SPACE", this.saltar, this);
        this.input.on("pointerdown", this.saltar, this);
    }

    // MÉTODO PARA CREAR SEGÚN EL PATRÓN
    ejecutarPatron() {
        if (this.nivelTerminado) return; 
        let evento = this.patron[this.indicePatron];
        if (evento.tipo === "spike") this.crearSpike();
        if (evento.tipo === "doble_spike") {
            this.crearSpike();
            this.time.delayedCall(200, () => this.crearSpike()); // El segundo spike un poco después
        }
        if (evento.tipo === "bloque") this.crearBloque(evento.altura);
        if (evento.tipo === "fin") {
        this.nivelTerminado = true;
        this.terminarNivel(); // ← llama al método de victoria
        return;
        }

        this.indicePatron++;
    }

    crearSpike() {
        let xSpawn = this.scale.width + 50; // derecha de la pantalla fija
    let spike = this.spikes.create(xSpawn, this.scale.height - 60, "spike");
    spike.setDisplaySize(40, 40);
    spike.setVelocityX(-this.velocidad);
    }

    crearBloque(altura) {
        let xSpawn = this.scale.width + 50;
    let bloque = this.bloques.create(xSpawn, this.scale.height - altura, "suelo");
    bloque.setDisplaySize(40, 40);
    bloque.refreshBody();
    }

    saltar() {
         if (this.jugador.body.blocked.down) {
        this.jugador.setVelocityY(-650);

        // Solo gira si NO está en powerup
        if (!this.enPowerUp && !this.enGracia) {
            this.tweens.killTweensOf(this.jugador);
            this.tweens.add({
                targets: this.jugador,
                angle: this.jugador.angle + 90,
                duration: 350,
                ease: 'Cubic.easeOut'
            });
        }
    }
    }

    crearBelt() {
     if (this.nivelTerminado) return;
     this.beltCount++; 

     let xSpawn = this.scale.width + 50;
     let belt = this.belts.create(xSpawn, this.scale.height - 80, "belt");
     belt.setDisplaySize(30, 30);
     belt.setVelocityX(-this.velocidad);

    // Efecto de flotación
    this.tweens.add({
        targets: belt,
        y: belt.y - 15,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
   }

   activarPowerUp(jugador, belt) {
    belt.destroy();
    this.enPowerUp = true;

    // Enderezar el personaje al transformarse
    this.tweens.killTweensOf(this.jugador);
    this.jugador.setAngle(0);

    this.jugador.setTexture("rider");
    this.estela.setParticleTint(0xFFD700);

    this.tweens.add({
        targets: this.jugador,
        alpha: 0.6,
        duration: 150,
        yoyo: true,
        repeat: -1,
    });

    this.time.delayedCall(4000, () => {

        this.enPowerUp = false;
        this.enGracia = true;

        this.tweens.killTweensOf(this.jugador);
        this.tweens.add({
            targets: this.jugador,
            alpha: 0.3,
            duration: 80,
            yoyo: true,
            repeat: -1,
        });

        this.time.delayedCall(2000, () => {
            this.enGracia = false;

            let skinActual = this.registry.get("skinSeleccionada") || "skin1";
            this.jugador.setTexture(skinActual);

            // Al volver a la skin original, resetear ángulo también
            this.tweens.killTweensOf(this.jugador);
            this.jugador.setAngle(0);
            this.jugador.setAlpha(1);

            let colorOriginal = this.coloresSkin[skinActual] || 0xffffff;
            this.estela.setParticleTint(colorOriginal);
        });
    });
}



    morir() {
        // No muere si está en powerup o en periodo de gracia
        if (this.enPowerUp || this.enGracia) return;
       this.estela.destroy();
       this.musica.stop();
       this.scene.restart({ intentos: this.intentos + 1 });
    }

    terminarNivel() {
        this.estela.stop();
        this.musica.stop();
        this.jugador.setVelocityX(0);
        this.jugador.setVelocityY(0);
        this.jugador.body.allowGravity = false;

        this.add.text(
        this.cameras.main.scrollX + this.scale.width / 2,
        this.scale.height / 2,
        "¡NIVEL COMPLETADO!",
        {
            fontSize: "64px",
            fill: "#FFD700",
            fontFamily: "Ceviche One",
            stroke: "#000000",
            strokeThickness: 8
        }
        ).setOrigin(0.5);
    }

    update(time, delta) {

        // Dentro del update, junto a la limpieza de spikes:
      this.belts.children.each(belt => {
      if (belt.x < -50) belt.destroy();
      });

        // Alinear rotación al aterrizar
     if (this.jugador.body.blocked.down) {
    let anguloActual = this.jugador.angle % 360;
    let anguloObjetivo = Math.round(anguloActual / 90) * 90;

    if (anguloActual !== anguloObjetivo) {
        this.tweens.killTweensOf(this.jugador);
        this.tweens.add({
            targets: this.jugador,
            angle: anguloObjetivo,
            duration: 80,
            ease: 'Power2'
        });
    }
}

        // MOVER EL FONDO SEGÚN LA VELOCIDAD
        this.fondo.tilePositionX += this.velocidad * (delta / 1000);

                // ===== MOVIMIENTO =====
        // El jugador no se mueve, siempre está fijo en X
        this.jugador.setVelocityX(0);
        this.jugador.x = 150; // lo ancla en pantalla

        // MOVER BLOQUES ESTÁTICOS (Como son StaticGroup, hay que moverlos manualmente)
        this.bloques.children.each(bloque => {
    bloque.x -= this.velocidad * (delta / 1000);
    bloque.refreshBody();
    if (bloque.x < -50) bloque.destroy(); // ya no necesitas scrollX
});

        // ===== LIMPIEZA =====
        this.spikes.children.each(spike => {
    if (spike.x < -50) spike.destroy();
});

        this.bloques.children.each(bloque => {
            if (bloque.x < this.cameras.main.scrollX - 50) bloque.destroy();
        });
    }
}

