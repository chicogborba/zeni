# Abre o personagem do ZENI (com ossos e as animações) no Blender.
#
# Como usar:
#   a) Dentro do Blender: aba "Scripting" > Open > escolha este arquivo > Run Script (Alt+P).
#   b) Pelo terminal (abre a janela do Blender já com o modelo):
#        /Applications/Blender.app/Contents/MacOS/Blender --python zeni-site/scripts/abrir-no-blender.py
#   c) Sem janela, só para gerar o .blend:
#        /Applications/Blender.app/Contents/MacOS/Blender -b --python zeni-site/scripts/abrir-no-blender.py
#
# O que faz: limpa a cena, importa src/assets/zeni-personagem.glb (malha "Corpo" + esqueleto "Esqueleto" + clipes),
# deixa os ossos visíveis por cima da malha, com nome, ajusta 30 fps e ativa o clipe A. Salva scripts/zeni-personagem.blend
# (só se rodar a opção b ou c; na opção a, salve você com Ctrl+S).
# Os clipes viram "Actions" (aba Animation / Dope Sheet > Action Editor). Todos ficam guardados (fake user).
#
# Base: scripts/fonte/zeni-personagem-montado.glb, o modelo SEM os ajustes de forma (o .glb do app já os tem).
#
# Para levar os ajustes de forma (QUEIXO, OMBROS, SOVACO, BRACOS) ao app, mude os valores abaixo e rode, na pasta zeni-site:
#        sh scripts/aplicar-ajustes.sh
# Ele troca só as posições dos vértices em src/assets/zeni-personagem.glb; ossos, pesos e clipes ficam iguais.
# Não use File > Export do Blender para isso: ele muda a orientação dos ossos e reamostra os clipes (docs/rig-atual.md).
# Requisitos do app (nomes de ossos e de clipes, escala em metros): docs/rig-atual.md.
#
# QUEIXO: desfaz o "canto" da mandíbula puxado para a direita (controles QUEIXO_* logo abaixo, no topo).
# OMBROS: baixa os ombros e alonga um pouco o pescoço (controles OMBROS_* logo abaixo, no topo).
# SOVACO: baixa e abre o sovaco (controles SOVACO_* logo abaixo, no topo).
# DEDOS: se o modelo ainda não tiver ossos de dedo, o script cria um por falange em cada mão (ligue/desligue em DEDOS)
# e prende cada bloco da malha ao osso certo. O modelo atual já vem com Fingers/FingersTip/Thumb/ThumbTip; nesse caso
# nada é criado. Para mexer: Pose Mode > clique no osso > tecla R e mova o mouse (R Z para girar só no eixo Z),
# ou aba Properties > Bone > Transform > Rotation.
# Nomes criados por este script: Thumb1/2 (polegar), Index1/2, Middle1/2, Ring1/2, com sufixo .L ou .R.
# O 1 é a falange da base, o 2 a ponta. Se for levar para o app, acrescente esses ossos em docs/rig-atual.md.
#
# Todos os ajustes de forma (queixo, ombros, sovaco, braços) mexem só na malha em repouso. Os ossos e os pesos
# não mudam, então os clipes continuam iguais.
import math
import os
from collections import Counter

import bpy
import numpy as np
from mathutils import Matrix, Vector

DEDOS = True   # False = não cria ossos de dedo

# QUEIXO: no preparo do modelo a cabeça foi girada 66° para ficar de frente, mas a mandíbula estava na faixa de
# transição do pescoço e girou só em parte. Por isso o canto dela ficou para trás, puxado para a direita.
# Este ajuste completa o giro só na mandíbula. A nuca e o miolo do pescoço não mexem.
# 0 desliga, 1 completa o giro. Se ainda sobrar canto, aumente QUEIXO_ALCANCE um pouco (ex.: 0.05);
# se o pescoço logo abaixo do queixo torcer, diminua (ex.: 0.04).
QUEIXO = 1.0
QUEIXO_ALCANCE = 0.045      # metros a partir do centro do pescoço: o que está mais longe que isso é mandíbula
QUEIXO_ALTURA = 0.0         # metros acima da base do pescoço onde o ajuste começa

# BRACOS: gira os dois braços inteiros (braço, antebraço, mão e dedos) para perto do corpo, em torno do ombro.
# Em graus. Positivo junta, negativo afasta. Se o braço entrar no tronco, diminua; se ainda estiver longe, aumente.
# ATENÇÃO: gira só a malha, não os ossos. Com 10°, as mãos e os dedos se deformam durante os clipes (testado no A).
# Para aproximar os braços sem quebrar os clipes, gire os ossos UpperArm nos próprios clipes, não aqui.
BRACOS_JUNTAR = 0.0

# OMBROS: desce os ombros e a base do pescoço. O queixo, as orelhas e o cabelo de cima não descem,
# então o pescoço fica mais comprido. O tronco vai descendo cada vez menos até o meio do peito, e o cotovelo não mexe.
# Valores são frações do comprimento do braço (ombro até cotovelo, ~0,27 m). 0 em DESCER desliga.
OMBROS_DESCER = 0.13        # quanto o topo do ombro desce (0.13 = ~3,5 cm). Ainda alto: aumente
OMBROS_PESCOCO = 0.5        # 0 a 1: quanto a base do pescoço acompanha (1 = desce junto com o ombro)
OMBROS_ESTREITAR = 0.16     # puxa a ponta do ombro e o alto do braço para dentro (ombro menos largo). Ainda largo: aumente
OMBROS_PONTA = 0.08         # desce a mais só a ponta do ombro (o "calombo" acima do braço). Ainda quadrado: aumente

# SOVACO: baixa e abre o sovaco. Valores são frações do comprimento do braço (osso UpperArm), então valem para qualquer escala.
# Se o sovaco ainda estiver alto demais, aumente SOVACO_DESCER. Se ainda estiver colado no tronco, aumente SOVACO_ABRIR.
# Se a região mexida ficar grande ou pequena demais, mude SOVACO_RAIO. 0 em DESCER e ABRIR desliga o ajuste.
SOVACO_DESCER = -0.04       # quanto o sovaco desce (negativo sobe: -0.04 = ~1 cm para cima)
SOVACO_TRONCO = 0.18        # alarga a lateral do tronco embaixo do braço (fecha o vão do sovaco, blusa menos colada)
SOVACO_ABRIR = 0.0          # quanto o braço se afasta do tronco na região do sovaco
SOVACO_RAIO = 0.60          # tamanho da região afetada, com transição suave nas bordas
SOVACO_PONTO_ALTURA = 0.30  # onde está o centro do sovaco, abaixo do ombro (fração do braço)
SOVACO_PONTO_DENTRO = 0.15  # e o quanto ele está para dentro, na direção do tronco

# ---------------------------------------------------------------------------------------------
# Caminhos. Se o script foi aberto de um arquivo, usa a pasta dele; senão cai no caminho fixo.
# ---------------------------------------------------------------------------------------------
PROJETO = "/Users/georgialirahoffmann/1001projects/zeni/zeni-site"
try:
    candidato = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), ".."))
    if os.path.isfile(os.path.join(candidato, "scripts", "fonte", "zeni-personagem-montado.glb")):
        PROJETO = candidato
except NameError:
    pass
# Base SEM os ajustes de forma (o .glb do app já os tem; abrir ele aplicaria tudo duas vezes).
GLB = os.path.join(PROJETO, "scripts", "fonte", "zeni-personagem-montado.glb")
BLEND = os.path.join(PROJETO, "scripts", "zeni-personagem.blend")

if not os.path.isfile(GLB):
    raise FileNotFoundError("Não achei o .glb em: %s\nConfira a variável PROJETO no topo do script." % GLB)


def _suave(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)


def _entre(x, a, b):
    """0 em a, 1 em b, com transição suave."""
    return _suave((x - a) / (b - a))


def _peca_principal(me):
    """Índices dos vértices da maior peça conectada (o corpo). Cabelo, olhos e sobrancelhas são peças à parte."""
    pai = list(range(len(me.vertices)))

    def raiz(a):
        while pai[a] != a:
            pai[a] = pai[pai[a]]
            a = pai[a]
        return a

    for e in me.edges:
        pai[raiz(e.vertices[0])] = raiz(e.vertices[1])
    maior = Counter(raiz(i) for i in range(len(pai))).most_common(1)[0][0]
    return {i for i in range(len(pai)) if raiz(i) == maior}


# ---------------------------------------------------------------------------------------------
# Dedos: acha os blocos da mão na malha, cria um osso por falange e prende cada bloco ao seu osso
# ---------------------------------------------------------------------------------------------
def _blocos_da_mao(corpo, lado):
    me = corpo.data
    gi = corpo.vertex_groups["Hand." + lado].index
    sel = {v.index for v in me.vertices if any(g.group == gi and g.weight > 0.5 for g in v.groups)}

    def chave(i):
        c = me.vertices[i].co
        return (round(c.x, 4), round(c.y, 4), round(c.z, 4))

    pai = {}

    def raiz(a):
        while pai.setdefault(a, a) != a:
            pai[a] = pai[pai[a]]
            a = pai[a]
        return a

    for p in me.polygons:
        if all(i in sel for i in p.vertices):
            ks = [chave(i) for i in p.vertices]
            for k in ks[1:]:
                pai[raiz(ks[0])] = raiz(k)
    grupos = {}
    for i in sel:
        grupos.setdefault(raiz(chave(i)), []).append(i)
    blocos = []
    for ids in grupos.values():
        pts = np.array([tuple(me.vertices[i].co) for i in ids])
        c = pts.mean(axis=0)
        d = np.linalg.svd(pts - c, full_matrices=False)[2][0]     # eixo mais comprido do bloco
        t = (pts - c) @ d
        blocos.append(dict(ids=ids, n=len(ids), c=Vector(c), a=Vector(c + d * t.min()), b=Vector(c + d * t.max())))
    return blocos


def _osso_do_bloco(bloco, ref):
    """(cabeça, ponta): a cabeça é a extremidade do bloco mais perto de 'ref'."""
    if (bloco["a"] - ref).length <= (bloco["b"] - ref).length:
        return bloco["a"], bloco["b"]
    return bloco["b"], bloco["a"]


def adicionar_dedos(esqueleto, corpo):
    if "Fingers.L" in esqueleto.data.bones or "Index1.L" in esqueleto.data.bones:
        print("O modelo já tem ossos de dedo; nada criado.")
        return
    ossos = []      # (nome, cabeça, ponta, pai)
    grupos = {}     # nome -> vértices
    for lado in ("L", "R"):
        blocos = _blocos_da_mao(corpo, lado)
        palma = max(blocos, key=lambda d: d["n"])
        pecas = sorted([d for d in blocos if d is not palma and d["n"] >= 20], key=lambda d: -d["c"].z)
        if len(pecas) != 8:
            print("AVISO: mão %s com %d falanges (esperava 8); dedos dessa mão ignorados." % (lado, len(pecas)))
            continue
        # as 2 peças mais altas são o polegar; o resto são 3 dedos de 2 falanges cada, do mais alto ao mais baixo
        cadeias = [("Thumb", pecas[:2])] + [(nome, pecas[2 + 2 * k: 4 + 2 * k])
                                           for k, nome in enumerate(("Index", "Middle", "Ring"))]
        for nome, par in cadeias:
            prox, dist = sorted(par, key=lambda d: (d["c"] - palma["c"]).length)
            h1, t1 = _osso_do_bloco(prox, palma["c"])
            h2 = t1
            t2 = dist["a"] if (dist["a"] - h2).length > (dist["b"] - h2).length else dist["b"]
            n1, n2 = "%s1.%s" % (nome, lado), "%s2.%s" % (nome, lado)
            ossos.append((n1, h1, t1, "Hand." + lado))
            ossos.append((n2, h2, t2, n1))
            grupos[n1] = (prox["ids"], "Hand." + lado)
            grupos[n2] = (dist["ids"], "Hand." + lado)

    if not ossos:
        return
    bpy.ops.object.select_all(action="DESELECT")
    esqueleto.select_set(True)
    bpy.context.view_layer.objects.active = esqueleto
    bpy.ops.object.mode_set(mode="EDIT")
    eb = esqueleto.data.edit_bones
    for nome, cab, pon, pai in ossos:
        b = eb.new(nome)
        b.head = cab
        b.tail = pon
        if (b.tail - b.head).length < 1e-4:
            b.tail = b.head + Vector((0, 0, 0.01))
        b.parent = eb[pai]
        eixo = (b.tail - b.head)
        giro = Vector((0, 0, 1)).cross(eixo)     # eixo X do osso = Z do mundo: girar em X fecha/abre o dedo
        if giro.length > 1e-6:
            b.align_roll(giro)
    bpy.ops.object.mode_set(mode="OBJECT")

    for nome, (ids, mao) in grupos.items():
        vg = corpo.vertex_groups.get(nome) or corpo.vertex_groups.new(name=nome)
        vg.add(ids, 1.0, "REPLACE")
        corpo.vertex_groups[mao].remove(ids)
    for nome, _, _, _ in ossos:
        pb = esqueleto.pose.bones[nome]
        pb.rotation_mode = "XYZ"
        pb.lock_location = (True, True, True)
    print("Ossos de dedo criados:", [o[0] for o in ossos])


# ---------------------------------------------------------------------------------------------
# Queixo: completa o giro da cabeça na mandíbula (ver QUEIXO no topo).
# Refaz a conta do preparo do modelo (scripts/preparar-modelo.mjs, passo 3): quanto cada vértice girou dependia
# da altura e da distância ao eixo do pescoço, e as duas não mudam com o giro. Aqui a mandíbula passa a girar inteira.
# Precisa rodar antes de ajustar_ombros, porque usa as alturas originais.
# ---------------------------------------------------------------------------------------------
def corrigir_queixo(esqueleto, corpo):
    if QUEIXO == 0:
        return
    me = corpo.data
    m = corpo.matrix_world.inverted() @ esqueleto.matrix_world
    eixo = m @ esqueleto.data.bones["Neck"].head_local     # o osso Neck foi posto no eixo do giro, na altura 15,2 da origem

    def altura(y_origem):                                  # altura no arquivo de origem -> z aqui (escala 0,09)
        return eixo.z + (y_origem - 15.2) * 0.09

    giro_total = math.radians(-66)
    raio = QUEIXO_ALCANCE
    z_ini = eixo.z + QUEIXO_ALTURA
    corpo_principal = _peca_principal(me)                  # cabelo e rosto já giraram inteiros no preparo
    n = 0
    for v in me.vertices:
        if v.index not in corpo_principal:
            continue
        c = v.co
        dx, dy = c.x - eixo.x, c.y - eixo.y
        rn = math.hypot(dx, dy)
        # quanto girou no preparo (mesma fórmula do preparar-modelo.mjs)
        feito = max(_entre(c.z, altura(15.1), altura(15.95)),
                    _entre(rn, 0.6 * 0.09, 0.9 * 0.09) * _entre(c.z, altura(15.3), altura(15.5)))
        # quanto deveria ter girado: mandíbula (longe do eixo, acima da base do pescoço) gira inteira
        certo = max(feito, _entre(rn, raio, raio + 0.015) * _entre(c.z, z_ini, z_ini + 0.015))
        frente = _suave((eixo.y + 0.035 - c.y) / 0.03)    # a nuca (atrás do eixo) fica como está
        a = giro_total * (certo - feito) * frente * QUEIXO
        if abs(a) < 1e-6:
            continue
        ca, sa = math.cos(a), math.sin(a)
        c.x = eixo.x + dx * ca - dy * sa
        c.y = eixo.y + dx * sa + dy * ca
        n += 1
    me.update()
    print("Queixo ajustado (%d vértices)." % n)


# ---------------------------------------------------------------------------------------------
# Ombros: desce ombros e base do pescoço; queixo, orelhas e cabelo de cima ficam. Ver OMBROS no topo.
# ---------------------------------------------------------------------------------------------
def ajustar_ombros(esqueleto, corpo):
    if OMBROS_DESCER == 0 and OMBROS_PONTA == 0 and OMBROS_ESTREITAR == 0:
        return
    me = corpo.data
    m = corpo.matrix_world.inverted() @ esqueleto.matrix_world
    ossos = esqueleto.data.bones
    centro_x = (m @ ossos["Chest"].head_local).x
    z_pescoco = (m @ ossos["Neck"].head_local).z
    ombro = m @ ossos["UpperArm.L"].head_local
    comp = (ombro - m @ ossos["Forearm.L"].head_local).length        # ombro até cotovelo
    dx_ombro = abs(ombro.x - centro_x)
    descer = comp * OMBROS_DESCER
    z_fim = ombro.z - comp * 0.5                                      # abaixo disso (meio do peito, cotovelo) não mexe
    for v in me.vertices:
        c = v.co
        lado = abs(c.x - centro_x)
        h = _entre(lado, 0.045, 0.085)                                # 0 no pescoço, 1 do trapézio para fora
        # teto: no pescoço, a base dele (o queixo fica acima); nos ombros, um pouco mais alto (orelha e cabelo acima)
        teto = z_pescoco + 0.025 * h
        faixa = 0.04 * (1 - h) + 0.02 * h
        fz = _suave((teto - c.z) / faixa) * _entre(c.z, z_fim, ombro.z)
        if fz <= 0:
            continue
        fh = OMBROS_PESCOCO + (1 - OMBROS_PESCOCO) * _entre(lado, 0.045, 0.045 + dx_ombro * 0.55)
        # ponta: cresce do meio do trapézio até a junta do ombro; só acima da junta, sumindo pelo braço abaixo
        fp = _entre(lado, dx_ombro * 0.45, dx_ombro) * _entre(c.z, ombro.z - comp * 0.35, ombro.z + comp * 0.05)
        c.z -= (descer * fh + comp * OMBROS_PONTA * fp) * fz
        # estreitar: da metade do trapézio para fora, do alto do ombro até o meio do braço (some rumo ao cotovelo)
        fe = _entre(lado, dx_ombro * 0.55, dx_ombro) * _entre(c.z, ombro.z - comp * 0.5, ombro.z - comp * 0.1)
        fe *= _suave((teto - c.z) / faixa)
        if fe > 0:
            c.x -= (1.0 if c.x > centro_x else -1.0) * comp * OMBROS_ESTREITAR * fe
    me.update()
    print("Ombros ajustados.")


# ---------------------------------------------------------------------------------------------
# Braços: gira o braço inteiro em torno do ombro, aproximando-o do tronco.
# Só a malha gira (os ossos ficam onde estão), então os clipes seguem valendo; a rotação vira um desvio fixo.
# ---------------------------------------------------------------------------------------------
def juntar_bracos(esqueleto, corpo):
    if BRACOS_JUNTAR == 0:
        return
    me = corpo.data
    m = corpo.matrix_world.inverted() @ esqueleto.matrix_world
    ossos = esqueleto.data.bones
    centro_x = (m @ ossos["Chest"].head_local).x
    partes = ("UpperArm", "Forearm", "Hand",
              "Fingers", "FingersTip", "Thumb", "ThumbTip",                     # dedos que já vêm no modelo
              "Thumb1", "Thumb2", "Index1", "Index2", "Middle1", "Middle2", "Ring1", "Ring2")   # dedos criados aqui
    for lado in ("L", "R"):
        ombro = m @ ossos["UpperArm." + lado].head_local
        sentido = 1.0 if ombro.x >= centro_x else -1.0          # +1 = lado de x positivo
        giro = Matrix.Rotation(math.radians(BRACOS_JUNTAR) * sentido, 3, "Y")   # em Y: z negativo (braço caído) anda para dentro
        idx = {corpo.vertex_groups[n + "." + lado].index for n in partes if (n + "." + lado) in corpo.vertex_groups}
        for v in me.vertices:
            w = min(1.0, sum(g.weight for g in v.groups if g.group in idx))
            if w <= 0:
                continue
            d = v.co - ombro
            v.co = ombro + (giro @ d) * w + d * (1.0 - w)
    me.update()
    print("Braços aproximados do corpo.")


# ---------------------------------------------------------------------------------------------
# Sovaco: desloca os vértices perto do centro do sovaco para baixo e para fora, com transição suave.
# ---------------------------------------------------------------------------------------------
def ajustar_sovaco(esqueleto, corpo):
    if SOVACO_DESCER == 0 and SOVACO_ABRIR == 0 and SOVACO_TRONCO == 0:
        return
    me = corpo.data
    m = corpo.matrix_world.inverted() @ esqueleto.matrix_world
    ossos = esqueleto.data.bones
    centro_x = (m @ ossos["Chest"].head_local).x
    for lado in ("L", "R"):
        braco = ossos["UpperArm." + lado]
        cab = m @ braco.head_local
        comp = (m @ braco.tail_local - cab).length
        dentro = Vector((centro_x - cab.x, 0.0, 0.0))
        dentro = dentro.normalized() if dentro.length > 1e-6 else Vector((-1.0 if lado == "L" else 1.0, 0.0, 0.0))
        ponto = cab + dentro * (comp * SOVACO_PONTO_DENTRO) + Vector((0.0, 0.0, -comp * SOVACO_PONTO_ALTURA))
        raio = comp * SOVACO_RAIO
        grupos_braco = {corpo.vertex_groups[n].index for n in ("UpperArm." + lado, "Forearm." + lado)
                        if n in corpo.vertex_groups}
        for v in me.vertices:
            d = (v.co - ponto).length
            if d >= raio:
                continue
            t = 1.0 - d / raio
            f = t * t * (3.0 - 2.0 * t)                       # transição suave (smoothstep)
            peso_braco = min(1.0, sum(g.weight for g in v.groups if g.group in grupos_braco))
            v.co += Vector((0.0, 0.0, -1.0)) * (comp * SOVACO_DESCER * f)    # desce
            v.co -= dentro * (comp * SOVACO_ABRIR * f * peso_braco)           # só o braço vai para fora
            v.co -= dentro * (comp * SOVACO_TRONCO * f * (1.0 - peso_braco))  # e o tronco embaixo dele também
    me.update()
    print("Sovaco ajustado.")


# ---------------------------------------------------------------------------------------------
# 1. cena limpa (sai do Pose Mode antes: em outro modo, apagar e importar falham)
# ---------------------------------------------------------------------------------------------
if bpy.context.object is not None and bpy.context.object.mode != "OBJECT":
    bpy.ops.object.mode_set(mode="OBJECT")
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for blocos in (bpy.data.meshes, bpy.data.armatures, bpy.data.actions, bpy.data.materials, bpy.data.images):
    for b in list(blocos):
        blocos.remove(b)

# ---------------------------------------------------------------------------------------------
# 2. importar UMA vez (o importador converte y-para-cima do glTF para z-para-cima do Blender)
# ---------------------------------------------------------------------------------------------
bpy.ops.import_scene.gltf(filepath=GLB)
esqueleto = next(o for o in bpy.data.objects if o.type == "ARMATURE")
malhas = [o for o in bpy.data.objects if o.type == "MESH"]
corpo = next((o for o in malhas if o.name.startswith("Corpo")), malhas[0])

ANTES = [v.co.copy() for v in corpo.data.vertices]   # para a exportação ao app (passo 7)
corrigir_queixo(esqueleto, corpo)      # primeiro: usa as alturas originais
ajustar_ombros(esqueleto, corpo)
ajustar_sovaco(esqueleto, corpo)
if DEDOS:
    adicionar_dedos(esqueleto, corpo)
juntar_bracos(esqueleto, corpo)

# ---------------------------------------------------------------------------------------------
# 3. ossos visíveis por cima da malha, com nome
# ---------------------------------------------------------------------------------------------
esqueleto.show_in_front = True
esqueleto.data.display_type = "OCTAHEDRAL"
esqueleto.data.show_names = True
corpo.display_type = "SOLID"

# ---------------------------------------------------------------------------------------------
# 4. clipes: 30 fps, todos guardados, o A ativo
#    (as faixas NLA criadas pelo importador ficam: é por elas que o export leva os clipes de volta)
# ---------------------------------------------------------------------------------------------
bpy.context.scene.render.fps = 30
acoes = sorted(bpy.data.actions, key=lambda a: a.name)
for a in acoes:
    a.use_fake_user = True
if esqueleto.animation_data is None:
    esqueleto.animation_data_create()
ativa = next((a for a in acoes if a.name.startswith("A_")), acoes[0] if acoes else None)
if ativa:
    esqueleto.animation_data.action = ativa
    bpy.context.scene.frame_start = int(ativa.frame_range[0])
    bpy.context.scene.frame_end = int(ativa.frame_range[1])
    bpy.context.scene.frame_set(int(ativa.frame_range[0]))

# ---------------------------------------------------------------------------------------------
# 5. selecionar o esqueleto e entrar em Pose Mode (se houver janela)
# ---------------------------------------------------------------------------------------------
bpy.ops.object.select_all(action="DESELECT")
esqueleto.select_set(True)
bpy.context.view_layer.objects.active = esqueleto
if not bpy.app.background:
    bpy.ops.object.mode_set(mode="POSE")

print("Ossos:", [b.name for b in esqueleto.data.bones])
print("Clipes:", [a.name for a in acoes])

# ---------------------------------------------------------------------------------------------
# 7. levar ao app: com a variável ZENI_AJUSTES_JSON, grava os vértices movidos (posição antes e depois, normal nova),
#    em coordenadas do glTF. scripts/aplicar-ajustes.sh usa isso para trocar só esses vértices no .glb do app,
#    sem mexer em ossos, pesos ou clipes.
# ---------------------------------------------------------------------------------------------
if os.environ.get("ZENI_AJUSTES_JSON"):
    import json
    movidos = []
    for v, o in zip(corpo.data.vertices, ANTES):
        if (v.co - o).length > 1e-7:
            n = v.normal                                       # Blender (x, y, z) -> glTF (x, z, -y)
            movidos.append([o.x, o.z, -o.y, v.co.x, v.co.z, -v.co.y, n.x, n.z, -n.y])
    with open(os.environ["ZENI_AJUSTES_JSON"], "w") as arq:
        json.dump(movidos, arq)
    print("Vértices movidos gravados:", len(movidos))

# ---------------------------------------------------------------------------------------------
# 6. salvar o .blend só nas opções b e c (terminal). No editor de texto (opção a), salve você com Ctrl+S.
# ---------------------------------------------------------------------------------------------
area = getattr(bpy.context, "area", None)
rodando_no_editor_de_texto = area is not None and area.type == "TEXT_EDITOR"
if not rodando_no_editor_de_texto and not os.environ.get("ZENI_AJUSTES_JSON"):
    os.makedirs(os.path.dirname(BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    print("Salvo em", BLEND)
else:
    print("Modelo aberto. Salve com Ctrl+S quando quiser.")
