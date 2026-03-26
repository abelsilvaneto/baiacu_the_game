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
        this.vel = 3
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

// ─────────────────────────────

class Text {
    des_text(text, x, y, cor, font, ctx) {  // ← adiciona ctx
        ctx.fillStyle = cor
        ctx.font = font
        ctx.fillText(text, x, y)
    }
}