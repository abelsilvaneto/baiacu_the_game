class Obj {
    constructor(x, y, w, h, src) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.img = new Image()
        this.img.onload = () => {} // reserva o slot antes
        this.img.src = src         // src DEPOIS do onload

        this.parryAtivo = false
        this.parryTempo = 0
        this.parryCooldown = 0

        this.bolha = new Image()
        this.bolha.src = './img/bolha.png' // coloca o caminho correto aqui
    }
}

// ─────────────────────────────

class Baiacu extends Obj {
    constructor(x, y, w, h, src) {
        super(x, y, w, h, src)

        this.dir = 0
        this.vida = 5
        this.pontos = 0
        this.vivo = true
        this.invulneravel = false
        this.tempoInv = 0
    }

ativarParry() {
    if (this.parryCooldown <= 0 && !this.parryAtivo) {
        this.parryAtivo = true
        this.parryTempo = 60      // 1 segundo (60fps)
        this.parryCooldown = 900  // 15 segundos (60 * 15)
    }
}


tomarDano() {
    if (this.parryAtivo) return // 🛡️ parry ativo = imortal

    if (!this.invulneravel) {
        this.vida--
        this.invulneravel = true
        this.tempoInv = 120
    }
}

    colid(obj) {
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        )
    }
}

// ─────────────────────────────

class Tubarao extends Obj {
    constructor(x, y, w, h, src) {
        super(x, y, w, h, src)
        this.vel = 6
    }

    mov_tubarao() {
        this.x -= this.vel

        if (this.x <= -200) {
            this.recomeca()
        }
    }

    recomeca() {
        this.x = 1300
        this.y = Math.floor(Math.random() * (650 - 62) + 62)
    }
}

class Megatubarao extends Tubarao {
    constructor(x, y, w, h, src) {
        super(x, y, w, h, src)

        this.vel = 7
        this.angulo = 0

        this.direcaoY = 1 // 1 = descendo, -1 = subindo
        this.velY = 2

        this.limiteCima = 0
        this.limiteBaixo = 600
    }

    mov_megatubarao() {
        // movimento horizontal
        this.x -= this.vel

        // movimento vertical (vai e volta)
        this.y += this.velY * this.direcaoY

        if (this.y <= this.limiteCima) {
            this.direcaoY = 1 // desce
        }

        if (this.y >= this.limiteBaixo) {
            this.direcaoY = -1 // sobe
        }

        // rotação contínua anti-horário
        this.angulo -= 0.05

        if (this.x <= -100) {
            this.recomeca()
        }
    }
}

// ─────────────────────────────

class Text {
    des_text(text, x, y, cor, font, ctx) {  // ← adiciona ctx
        ctx.fillStyle = cor
        ctx.font = font
        ctx.fillText(text, x, y)
    }
}

class Vida extends Obj {
    constructor(x, y, w, h, src) {
        super(x, y, w, h, src)
        this.vel = 3
    }

    mover() {
        this.x -= this.vel
    }

    desenhar(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    }

    saiuTela() {
        return this.x < -100
    }
}