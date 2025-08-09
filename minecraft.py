from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()
Sky(texture='sky_sunset')
player = FirstPersonController()

sword = Entity(model=r'assets/blade', texture=r'assets/sword', rotation=(300, -400),
               position=(0.6, -0.6), parent=camera.ui, scale=(0.2, 0.15))

def update():
    if held_keys['left mouse'] or held_keys['right mouse']:
        sword.position = (0.6, -0.5)
    else:
        sword.position = (0.7, -0.6)

boxes = []
for n in range(12):
    for k in range(12):
        # Setting the block color to green directly
        box = Button(model='cube', position=(k, 0, n),
                     texture=r'assets/grass', color=color.rgb(145, 192, 203), parent=scene, origin_y=0.5)

        boxes.append(box)

def input(key):
    for box in boxes:
        if box.hovered:
            if key == 'left mouse down':
                # Adding a new block
                new_box = Button(model='cube', position=box.position + mouse.normal,
                                 texture=r'assets/grass', color=color.lime, parent=scene, origin_y=0.5)
                boxes.append(new_box)
            elif key == 'right mouse down':
                # Removing the hovered block when the right mouse button is pressed
                boxes.remove(box)
                destroy(box)

app.run()
