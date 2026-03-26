let des = document.getElementById('des').getContext('2d')

// 🌆 FUNDO
let bg = new Image()
bg.src = './img/fundo.png'
let bgX = 0


// 🚗 INIMIGOS
let tubarao  = new Tubarao(1300, 325, 80, 50, './img/PC_Computer_1bg.png')
let tubarao2 = new Tubarao(1500, 125, 80, 50, './img/PC_Computer_1bg.png')
let tubarao3 = new Tubarao(1700, 400, 80, 50, './img/PC_Computer_1bg.png')

// 🐡 JOGADORES (BAIACU)
let baiacu1 = new Baiacu(100, 250, 80, 50, './img/baiacu_0_bg.png')
let baiacu2 = new Baiacu(100, 420, 80, 50, './img/baiacu_1_bg.png')

// HUD
let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()


let fase = 1
let jogar = true

// 🎮 CONTROLES
let keys = {}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true
    if (e.key === 'Shift') baiacu1.ativarParry()
if (e.key === 'Enter') baiacu2.ativarParry()
})

document.addEventListener('keyup', (e) => {
    keys[e.key] = false
})

// 💥 COLISÃO
function colisao() {
    let inimigos = [tubarao, tubarao2, tubarao3]

    inimigos.forEach(inimigo => {
        if (baiacu1.vivo && baiacu1.colid(inimigo)) {
            inimigo.recomeca()
            baiacu1.tomarDano()
        }

        if (baiacu2.vivo && baiacu2.colid(inimigo)) {
            inimigo.recomeca()
            baiacu2.tomarDano()
        }
    })
}

// ⭐ PONTUAÇÃO
function pontuacao() {
    let inimigos = [tubarao, tubarao2, tubarao3]

    inimigos.forEach(inimigo => {
        if (inimigo.x <= -100) {
            if (baiacu1.vivo) baiacu1.pontos += 5
            if (baiacu2.vivo) baiacu2.pontos += 5
            inimigo.recomeca()
        }
    })
}

// 🎯 FASE
function ver_fase() {
    let melhor = Math.max(baiacu1.pontos, baiacu2.pontos)

    if (melhor > 20 && fase === 1) {
        fase = 2
        tubarao.vel = tubarao2.vel = tubarao3.vel = 5
    }
    else if (melhor > 40 && fase === 2) {
        fase = 3
        tubarao.vel = tubarao2.vel = tubarao3.vel = 7
    }
        // 🔥 NOVO: aceleração infinita na fase 3
    if (fase === 3) {
        tubarao.vel += 0.01
        tubarao2.vel += 0.01
        tubarao3.vel += 0.01
    }
}

// 💀 GAME OVER
function game_over() {
    if (baiacu1.vida <= 0) baiacu1.vivo = false
    if (baiacu2.vida <= 0) baiacu2.vivo = false

    if (!baiacu1.vivo && !baiacu2.vivo) {
        jogar = false
        // Tela de Game Over
        des.fillStyle = 'rgba(0,0,0,0.6)'
        des.fillRect(0, 0, 1200, 700)
        des.fillStyle = 'red'
        des.font = 'bold 80px monospace'
        des.textAlign = 'center'
        des.fillText('GAME OVER', 600, 320)
        des.fillStyle = 'white'
        des.font = '30px monospace'
        des.fillText(`J1: ${baiacu1.pontos} pts   J2: ${baiacu2.pontos} pts`, 600, 400)
    }
}

// 🧾 HUD
function desenha_hud() {
    t1.des_text(`J1: ${baiacu1.pontos} pts`, 20, 30, 'cyan', '20px monospace', des)
    t1.des_text(`Vida: ${'❤️'.repeat(baiacu1.vida)}`, 20, 58, 'cyan', '16px monospace', des)
    t1.des_text(`Parry: ${Math.ceil(baiacu1.parryCooldown / 60)}s`, 20, 80, 'cyan', '16px monospace', des)

    t2.des_text(`J2: ${baiacu2.pontos} pts`, 900, 30, 'lime', '20px monospace', des)
    t2.des_text(`Vida: ${'❤️'.repeat(baiacu2.vida)}`, 900, 58, 'lime', '16px monospace', des)
    t2.des_text(`Parry: ${Math.ceil(baiacu2.parryCooldown / 60)}s`, 900, 80, 'lime', '16px monospace', des)

    fase_txt.des_text(`Fase: ${fase}`, 550, 30, 'white', '20px monospace', des)

    
}

// 🎨 DESENHAR
function desenha() {

    // FUNDO
    des.drawImage(bg, bgX, 0, 1200, 700)
    des.drawImage(bg, bgX + 1200, 0, 1200, 700)

    des.drawImage(bg, bgX, 0, 1200, 700)
des.drawImage(bg, bgX + 1200, 0, 1200, 700)

if (bgX <= -1200) {
    bgX = 0
}

bgX -= tubarao.vel * 0.5

    // INIMIGOS
    des.drawImage(tubarao.img,  tubarao.x,  tubarao.y,  tubarao.w,  tubarao.h)
    des.drawImage(tubarao2.img, tubarao2.x, tubarao2.y, tubarao2.w, tubarao2.h)
    des.drawImage(tubarao3.img, tubarao3.x, tubarao3.y, tubarao3.w, tubarao3.h)

    // 🐡 JOGADORES
    if (baiacu1.vivo) {
        if (baiacu1.invulneravel && Math.floor(baiacu1.tempoInv / 5) % 2 === 0) {
            des.globalAlpha = 0.3
        }
        des.drawImage(baiacu1.img, baiacu1.x, baiacu1.y, baiacu1.w, baiacu1.h)
        des.globalAlpha = 1
    }

    if (baiacu2.vivo) {
        if (baiacu2.invulneravel && Math.floor(baiacu2.tempoInv / 5) % 2 === 0) {
            des.globalAlpha = 0.3
        }
        des.drawImage(baiacu2.img, baiacu2.x, baiacu2.y, baiacu2.w, baiacu2.h)
        des.globalAlpha = 1
    }
if (baiacu1.parryAtivo) {
    des.drawImage(
        baiacu1.bolha,
        baiacu1.x - 10,
        baiacu1.y - 10,
        baiacu1.w + 20,
        baiacu1.h + 20
    )
}

// 🫧 BOLHA J2
if (baiacu2.parryAtivo) {
    des.drawImage(
        baiacu2.bolha,
        baiacu2.x - 10,
        baiacu2.y - 10,
        baiacu2.w + 20,
        baiacu2.h + 20
    )
}

    desenha_hud()
}
function moverJogadores() {

    // JOGADOR 1
    if (keys['w']) baiacu1.y -= 5
    if (keys['s']) baiacu1.y += 5

    // JOGADOR 2
    if (keys['ArrowUp']) baiacu2.y -= 5
    if (keys['ArrowDown']) baiacu2.y += 5

    // LIMITES
    baiacu1.y = Math.max(62, Math.min(650, baiacu1.y))
    baiacu2.y = Math.max(62, Math.min(650, baiacu2.y))
}

// 🔄 ATUALIZA
function atualiza() {
    if (!jogar) return
 
    bgX -= 2

    moverJogadores()

    tubarao.mov_tubarao()
    tubarao2.mov_tubarao()
    tubarao3.mov_tubarao()

// J1
if (baiacu1.parryAtivo) {
    baiacu1.parryTempo--
    if (baiacu1.parryTempo <= 0) baiacu1.parryAtivo = false
}

if (baiacu1.parryCooldown > 0) baiacu1.parryCooldown--

// J2
if (baiacu2.parryAtivo) {
    baiacu2.parryTempo--
    if (baiacu2.parryTempo <= 0) baiacu2.parryAtivo = false
}

if (baiacu2.parryCooldown > 0) baiacu2.parryCooldown--

    if (baiacu1.invulneravel) baiacu1.tempoInv--
    if (baiacu2.invulneravel) baiacu2.tempoInv--

    if (baiacu1.tempoInv <= 0) baiacu1.invulneravel = false
    if (baiacu2.tempoInv <= 0) baiacu2.invulneravel = false

    colisao()
    pontuacao()
    ver_fase()
    game_over()
}

// 🔁 LOOP
function main() {
    des.clearRect(0, 0, 1200, 700)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

// 🚀 AGUARDA TODAS AS IMAGENS CARREGAREM

let todasImagens = [bg, baiacu1.img, baiacu2.img, tubarao.img,    baiacu1.bolha,
    baiacu2.bolha, tubarao2.img, tubarao3.img]
let carregadas = 0

todasImagens.forEach(img => {
    const original = img.onload
    img.onload = () => {
        if (original) original()
        carregadas++
        if (carregadas === todasImagens.length) main()
    }
    // Se a imagem já estava cacheada e carregou antes do onload ser setado:
    if (img.complete) {
        img.onload()
    }
})