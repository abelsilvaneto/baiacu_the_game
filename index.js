let des = document.getElementById('des').getContext('2d')

let musicaJogo = new Audio('./img/games.wav')
let musicaVitoria = new Audio('./img/ganhou.mp3')
let musicaGameOver = new Audio('./img/perdeu.mp3')
let musicaMenu = new Audio('./img/menu.mp3')

musicaJogo.loop = true
musicaMenu.loop = true

musicaMenu.volume = 0.5
musicaJogo.volume = 0.5
musicaVitoria.volume = 0.7
musicaGameOver.volume = 0.7

//  FUNDO
let bg = new Image()
bg.src = './img/fundo.png'

let bg2 = new Image()
bg2.src = './img/fundo2.png'

let bg3 = new Image()
bg3.src = './img/fundo3.png'
let bgX = 0
let velocidadeFundo = 3

//  CAPA
let capa = new Image()
capa.src = './img/capa.png'

let capaVitoria = new Image()
capaVitoria.src = './img/vitoria.png'

let mouseX = 0
let mouseY = 0

//  INIMIGOS
let megatubarao = [
    new Megatubarao(1400, 300, 80, 80, './img/mega_tubarao1.png'),
    new Megatubarao(1400, 300, 80, 80, './img/mega_tubarao1.png'),
    new Megatubarao(1400, 300, 80, 80, './img/mega_tubarao1.png')

]
let tubarao = new Tubarao(1300, 325, 80, 50, './img/PC_Computer_1bg.png')
let tubarao2 = new Tubarao(1500, 125, 80, 50, './img/PC_Computer_1bg.png')
let tubarao3 = new Tubarao(1700, 400, 80, 50, './img/PC_Computer_1bg.png')


let vidaItem = new Vida(1400, 200, 50, 50, './img/coracao.png')
let tempoVida = 0


//  JOGADORES (BAIACU)
let baiacu1 = new Baiacu(100, 250, 80, 50, './img/baiacu_0_bg.png')
let baiacu2 = new Baiacu(100, 420, 80, 50, './img/baiacu_1_bg.png')

// HUD
let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()


let fase = 1
let jogar = true
let estado = 'menu' 
let botoes = [
    { texto: 'JOGAR', x: 450, y: 300, w: 300, h: 60 },
    { texto: 'SOBRE MIN', x: 450, y: 380, w: 300, h: 60 },
    { texto: 'CONTROLES', x: 450, y: 460, w: 300, h: 60 }
]


document.addEventListener('keydown', (e) => {

    // ESC volta pro menu
    if (e.key === 'Escape') {
        estado = 'menu'
    }

    // EXEMPLO: começar pelo teclado também
    if (estado === 'menu' && e.key === 'Enter') {
        estado = 'jogo'
    }
})

document.addEventListener('mousemove', (e) => {
    let rect = des.canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
})

let audioLiberado = false

document.addEventListener('click', () => {
    if (!audioLiberado) {
        musicaMenu.play().then(() => {
            musicaMenu.pause()
            musicaMenu.currentTime = 0
            audioLiberado = true
        }).catch(() => {})
    }
}, { once: true })

let musicaAtual = null

function tocarMusica(musica) {
    if (!audioLiberado) return

    if (musicaAtual === musica) return

    if (musicaAtual) {
        musicaAtual.pause()
        musicaAtual.currentTime = 0
    }

    musicaAtual = musica
    musicaAtual.play().catch(() => {})
}

document.addEventListener('click', (e) => {
    if (estado !== 'menu') return

    let rect = des.canvas.getBoundingClientRect()
    let mouseX = e.clientX - rect.left
    let mouseY = e.clientY - rect.top

    botoes.forEach(btn => {
        if (
            mouseX >= btn.x &&
            mouseX <= btn.x + btn.w &&
            mouseY >= btn.y &&
            mouseY <= btn.y + btn.h
        ) {
            clicarBotao(btn.texto)
        }
    })
})
//  CONTROLES
let keys = {}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true

    // ESC volta pro menu
    if (e.key === 'Escape') {
        estado = 'menu'
    }

    // ENTER inicia jogo no menu
    if (estado === 'menu' && e.key === 'Enter') {
        estado = 'jogo'
    }

    // reiniciar
    if ((estado === 'gameover' || estado === 'vitoria') && e.key === 'r') {
    resetarJogo()
}

    // parry
    if (e.key === 'Shift') baiacu1.ativarParry()
    if (e.key === 'Enter') baiacu2.ativarParry()
})

document.addEventListener('keyup', (e) => {
    keys[e.key] = false
})

//  COLISÃO
    function colisao() {

    let inimigos = fase < 3 
        ? [tubarao, tubarao2, tubarao3]
        : []

    // J1 pega vida
// J1 pega vida
if (baiacu1.vivo && baiacu1.colid(vidaItem)) {
    if (baiacu1.vida < 5) baiacu1.vida++
    vidaItem.x = -200
}

// J2 pega vida
if (baiacu2.vivo && baiacu2.colid(vidaItem)) {
    if (baiacu2.vida < 5) baiacu2.vida++
    vidaItem.x = -200
}

if (fase === 3) {
    megatubarao.forEach(m => {

        if (baiacu1.vivo && baiacu1.colid(m)) {
            m.recomeca()
            baiacu1.tomarDano()
        }

        if (baiacu2.vivo && baiacu2.colid(m)) {
            m.recomeca()
            baiacu2.tomarDano()
        }

    })
}

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

function clicarBotao(texto) {
    if (texto === 'JOGAR') estado = 'jogo'
    else if (texto === 'SOBRE MIN') estado = 'criador'
    else if (texto === 'CONTROLES') estado = 'controles'
}




//  FASE
function ver_fase() {
    let melhor = Math.max(baiacu1.pontos, baiacu2.pontos)

    if (melhor > 300 && fase === 1) {
        fase = 2
        tubarao.vel = tubarao2.vel = tubarao3.vel = 10
    }
    else if (melhor > 600 && fase === 2) {
        fase = 3
        tubarao.vel = tubarao2.vel = tubarao3.vel = 14
    }
    //  NOVO: aceleração infinita na fase 3
    if (fase === 3) {
        megatubarao.forEach(m => m.vel += 0.002)
    }
}

//  GAME OVER
function game_over() {
    if (baiacu1.vida <= 0) baiacu1.vivo = false
    if (baiacu2.vida <= 0) baiacu2.vivo = false

    if (!baiacu1.vivo && !baiacu2.vivo) {
        estado = 'gameover' // 👈 MUDA AQUI
            // Tela de Game Over
    }


}

    function vitoria() {
    if (baiacu1.pontos >= 1200 || baiacu2.pontos >= 1200) {
        estado = 'vitoria'
            }
        }
function resetarJogo() {
    // jogadores
    baiacu1.x = 100
    baiacu1.y = 250
    baiacu1.vida = 5
    baiacu1.pontos = 0
    baiacu1.vivo = true

    baiacu2.x = 100
    baiacu2.y = 420
    baiacu2.vida = 5
    baiacu2.pontos = 0
    baiacu2.vivo = true

    // inimigos
    megatubarao.forEach(m => {
        m.x = 1400
        m.y = Math.random() * (650 - 62) + 62
        m.vel = 7
    })
    tubarao.recomeca()
    tubarao2.recomeca()
    tubarao3.recomeca()

    tubarao.vel = 3
    tubarao2.vel = 3
    tubarao3.vel = 3

    // fase
    fase = 1

    // jogo volta
    estado = 'jogo'
}

//  HUD
function desenha_hud() {
    t1.des_text(`J1: ${Math.floor(baiacu1.pontos)} pts`, 100, 30, 'cyan', '20px monospace', des)

t1.des_text(`Vida: ${'❤️'.repeat(Math.max(0, baiacu1.vida || 0))}`, 100, 58, 'cyan', '16px monospace', des)
t2.des_text(`Vida: ${'❤️'.repeat(Math.max(0, baiacu2.vida || 0))}`, 1100, 58, 'lime', '16px monospace', des)

t1.des_text(`Parry: ${Math.ceil((baiacu1.parryCooldown || 0) / 60)}s`, 100, 80, 'cyan', '16px monospace', des)
t2.des_text(`Parry: ${Math.ceil((baiacu2.parryCooldown || 0) / 60)}s`, 1100, 80, 'lime', '16px monospace', des)

    t2.des_text(`J2: ${Math.floor(baiacu2.pontos)} pts`, 1100, 30, 'lime', '20px monospace', des)

    fase_txt.des_text(`Fase: ${fase}`, 620, 30, 'white', '20px monospace', des)

}

function desenha_gameover() {
    // fundo escuro
    des.fillStyle = 'rgba(0,0,0,0.7)'
    des.fillRect(0, 0, 1200, 700)

    // texto
    des.fillStyle = 'red'
    des.font = 'bold 80px monospace'
    des.textAlign = 'center'
    des.fillText('GAME OVER', 600, 300)

    des.fillStyle = 'white'
    des.font = '30px monospace'
    des.fillText(`J1: ${Math.floor(baiacu1.pontos)} pts   J2: ${Math.floor(baiacu2.pontos)} pts`, 600, 380)

    des.font = '25px monospace'
    des.fillText('Pressione R para reiniciar', 600, 450)
}

function desenha_menu() {
    des.drawImage(capa, 0, 0, 1200, 700)

    des.fillStyle = 'white'
    des.font = 'bold 50px monospace'
    des.textAlign = 'center'


    botoes.forEach(btn => {
        let hover =
            mouseX >= btn.x &&
            mouseX <= btn.x + btn.w &&
            mouseY >= btn.y &&
            mouseY <= btn.y + btn.h

        //  muda cor se estiver em cima
        des.fillStyle = hover ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.6)'
        des.fillRect(btn.x, btn.y, btn.w, btn.h)

        des.fillStyle = 'white'
        des.font = hover ? '30px monospace' : '25px monospace'
        des.fillText(btn.texto, btn.x + btn.w / 2, btn.y + 40)
    })
}

//  DESENHAR
function desenha() {

    // FUNDO
    let bgAtual

    if (fase === 1) bgAtual = bg
    else if (fase === 2) bgAtual = bg2
    else if (fase === 3) bgAtual = bg3

    des.drawImage(bgAtual, bgX, 0, 1200, 700)
    des.drawImage(bgAtual, bgX + 1200, 0, 1200, 700)



    // INIMIGOS
if (fase < 3) {
    des.drawImage(tubarao.img, tubarao.x, tubarao.y, tubarao.w, tubarao.h)
    des.drawImage(tubarao2.img, tubarao2.x, tubarao2.y, tubarao2.w, tubarao2.h)
    des.drawImage(tubarao3.img, tubarao3.x, tubarao3.y, tubarao3.w, tubarao3.h)
}


if (fase === 3) {
megatubarao.forEach(m => {

    des.save()

    // move o ponto de rotação pro centro do tubarão
    des.translate(m.x + m.w / 2, m.y + m.h / 2)

    // rotação (anti-horário)
    des.rotate(m.angulo)

    // desenha centralizado
    des.drawImage(m.img, -m.w / 2, -m.h / 2, m.w, m.h)

    des.restore()
})
}

    vidaItem.desenhar(des)

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

function desenha_vitoria() {
    // fundo escuro
    des.drawImage(capaVitoria, 0, 0, 1200, 700)

    // texto por cima
    des.fillStyle = 'yellow'
    des.font = 'bold 80px monospace'
    des.textAlign = 'center'

    let vencedor = baiacu1.pontos > baiacu2.pontos ? 'JOGADOR 1' : 'JOGADOR 2'

    des.fillStyle = 'white'
    des.font = '30px monospace'
    des.fillText(`${vencedor} venceu!`, 600, 150)

    des.fillText(`J1: ${Math.floor(baiacu1.pontos)} pts`, 600, 420)
    des.fillText(`J2: ${Math.floor(baiacu2.pontos)} pts`, 600, 460)

    des.font = '25px monospace'
    des.fillText('Pressione R para reiniciar', 600, 550)
}


function desenha_criador() {
    des.fillStyle = 'black'
    des.fillRect(0, 0, 1200, 700)

    des.fillStyle = 'white'
    des.textAlign = 'center'
    des.fillText('Criado por: Abel Silva Neto na escola sesi senai ', 600, 300)
    des.fillText('Email: abel_silva-neto@estudante.sesisenai.org.br ', 600, 350)
    des.fillText('Product Owner: carlos Roberto da silva filho', 600, 400)
    des.fillText('Telefone: (47) 99614-7194 ', 600, 450)
    des.fillText('ESC para voltar', 600, 500)
}

function desenha_controles() {
    des.fillStyle = 'black'
    des.fillRect(0, 0, 1200, 700)

    des.fillStyle = 'white'
    des.textAlign = 'center'
    des.fillText('P1 W/S e P2 ↑/↓ para mover', 600, 300)
    des.fillText('P1 Shift = Parry', 600, 350)
    des.fillText('P2 Enter = Parry', 600, 400)
    des.fillText('Para vencer chegue em 2000 vivo', 600, 450)
    des.fillText('ESC para voltar', 600, 500)
}

function moverJogadores() {

if (baiacu1.vivo) {
    if (keys['w']) baiacu1.y -= 5
    if (keys['s']) baiacu1.y += 5
}

if (baiacu2.vivo) {
    if (keys['ArrowUp']) baiacu2.y -= 5
    if (keys['ArrowDown']) baiacu2.y += 5
}

    // LIMITES
    baiacu1.y = Math.max(62, Math.min(650, baiacu1.y))
    baiacu2.y = Math.max(62, Math.min(650, baiacu2.y))
}

//  ATUALIZA
function atualiza() {
    if (estado === 'vitoria') return
    if (!jogar) return

        let ganho = 0.1

if (fase === 2) ganho = 0.15
if (fase === 3) ganho = 0.2

if (baiacu1.vivo) baiacu1.pontos += ganho
if (baiacu2.vivo) baiacu2.pontos += ganho


    if (bgX <= -1200) {
        bgX = 0
    }

    if (fase < 3) {
    bgX -= tubarao.vel * 0.5
} else {
    bgX -= 4 // velocidade fixa na fase 3
}

    vidaItem.mover()

    moverJogadores()

tempoVida--

if (tempoVida <= 0 && vidaItem.x < -100) {
    vidaItem.x = 1400
    vidaItem.y = Math.random() * (650 - 62) + 62

     tempoVida = Math.random() * 1200 + 600 // 👈 AQUI
}

    if (fase < 3) {
    tubarao.mov_tubarao()
    tubarao2.mov_tubarao()
    tubarao3.mov_tubarao()
}

    if (fase === 3) {
    megatubarao.forEach(m => {
        m.mov_megatubarao()
    })
}

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
    ver_fase()
    game_over()
    vitoria()
}

    //  LOOP
function main() {
    des.clearRect(0, 0, 1200, 700)

    if (estado === 'menu') {
    if (musicaMenu.paused) {
        musicaMenu.play()
    }
    desenha_menu()
}else if (estado === 'jogo') {
    musicaMenu.pause()
    musicaMenu.currentTime = 0

    desenha()
    atualiza()
}
    if (estado === 'menu') {
        tocarMusica(musicaMenu)
        desenha_menu()
    }
    else if (estado === 'jogo') {
        tocarMusica(musicaJogo)

        desenha()
        atualiza()
    }
    else if (estado === 'gameover') {
        tocarMusica(musicaGameOver)

        desenha()
        desenha_gameover()
    }
    else if (estado === 'criador') { 
        desenha_criador()
    }
    else if (estado === 'controles') {
        desenha_controles()
    }else if (estado === 'vitoria') {
    tocarMusica(musicaVitoria)
    
    desenha_vitoria()
}

    requestAnimationFrame(main)
}

//  AGUARDA TODAS AS IMAGENS CARREGAREM

let todasImagens = [bg, bg2, bg3, capa, capaVitoria, vidaItem.img, baiacu1.img, baiacu2.img, tubarao.img, baiacu1.bolha,
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