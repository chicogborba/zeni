# Abre o personagem do ZENI (com ossos e as 6 animações) no Blender.
#
# Como usar:
#   a) Dentro do Blender: aba "Scripting" > Open > escolha este arquivo > Run Script (Alt+P).
#   b) Pelo terminal (abre a janela do Blender já com o modelo):
#        /Applications/Blender.app/Contents/MacOS/Blender --python zeni-site/scripts/abrir-no-blender.py
#   c) Sem janela, só para gerar o .blend:
#        /Applications/Blender.app/Contents/MacOS/Blender -b --python zeni-site/scripts/abrir-no-blender.py
#
# O que faz: limpa a cena, importa src/assets/zeni-personagem.glb (malha "Corpo" + esqueleto "Esqueleto" + clipes A–F),
# deixa os ossos visíveis por cima da malha, com nome, ajusta 30 fps e ativa o clipe A. Salva scripts/zeni-personagem.blend
# (só se rodar a opção b ou c; na opção a, salve você com Ctrl+S).
# Os clipes viram "Actions" (aba Animation / Dope Sheet > Action Editor). Os 6 ficam guardados (fake user).
#
# Para devolver ao app depois de editar no Blender: File > Export > glTF 2.0 (.glb), com "Animation" ligado,
# "Always Sample Animations" ligado e "Skinning" ligado, e substitua src/assets/zeni-personagem.glb.
# Requisitos do app (nomes de ossos e de clipes, escala em metros): docs/rig-atual.md.
import os
import bpy

# Caminho do .glb. Em Text editor __file__ não existe; então usa o caminho do projeto direto.
PROJETO = "/Users/georgialirahoffmann/1001projects/zeni/zeni-site"
try:
    PROJETO = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
except NameError:
    pass
GLB = os.path.join(PROJETO, "src", "assets", "zeni-personagem.glb")
BLEND = os.path.join(PROJETO, "scripts", "zeni-personagem.blend")

# 1. cena limpa
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
for blocos in (bpy.data.meshes, bpy.data.armatures, bpy.data.actions, bpy.data.materials):
    for b in list(blocos):
        blocos.remove(b)

# 2. importar (o importador converte y-para-cima do glTF para z-para-cima do Blender)
bpy.ops.import_scene.gltf(filepath=GLB)

esqueleto = next(o for o in bpy.data.objects if o.type == "ARMATURE")
corpo = next(o for o in bpy.data.objects if o.type == "MESH")

# 3. ossos visíveis por cima da malha, com nome
esqueleto.show_in_front = True
esqueleto.data.display_type = "OCTAHEDRAL"
esqueleto.data.show_names = True
corpo.display_type = "SOLID"

# 4. clipes: 30 fps, todos guardados, o A ativo
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

# 5. selecionar o esqueleto e entrar em Pose Mode (se houver janela), para ver e girar os ossos
bpy.ops.object.select_all(action="DESELECT")
esqueleto.select_set(True)
bpy.context.view_layer.objects.active = esqueleto
if not bpy.app.background:
    bpy.ops.object.mode_set(mode="POSE")

print("Ossos:", [b.name for b in esqueleto.data.bones])
print("Clipes:", [a.name for a in acoes])
if bpy.app.background or "__file__" in globals():
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    print("Salvo em", BLEND)
