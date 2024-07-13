import Konva from 'konva'
import './style.css'
import ImageLoaderService from './services/imageLoaderService'
import dataAnimals, { background } from './sources'
import { AnimalImages } from './types/images'

const imageLoaderService: ImageLoaderService = new ImageLoaderService()
const backgroundImage = await imageLoaderService.load(
  background.src,
  background.width,
  background.height,
)

const animalImages: AnimalImages = {}
for (const [name, animal] of Object.entries(dataAnimals)) {
  animalImages[name] = {
    origin: await imageLoaderService.load(animal.fileNames.target, animal.width, animal.height),
    glow: await imageLoaderService.load(animal.fileNames.glow, animal.width, animal.height),
    drop: await imageLoaderService.load(animal.fileNames.drop, animal.width, animal.height),
  }
}

var sources = {
  beach: backgroundImage,
  lion: animalImages.lion.origin,
  lion_glow: animalImages.lion.glow,
  lion_black: animalImages.lion.drop,
}

initStage(sources)

console.log('animalImages', animalImages)

function isNearOutline(animal, outline) {
  var a = animal
  var o = outline
  var ax = a.x()
  var ay = a.y()

  if (ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
    return true
  } else {
    return false
  }
}
function drawBackground(background, beachImg, text) {
  var context = background.getContext()
  context.drawImage(beachImg, 0, 0)
  context.setAttr('font', '20pt Calibri')
  context.setAttr('textAlign', 'center')
  context.setAttr('fillStyle', 'white')
  context.fillText(text, background.getStage().width() / 2, 40)
}

function initStage(images) {
  var stage = new Konva.Stage({
    container: 'app',
    width: 1920,
    height: 1000,
  })
  var background = new Konva.Layer()
  var animalLayer = new Konva.Layer()
  var animalShapes = []
  var score = 0

  // image positions
  var animals = {
    snake: {
      x: 10,
      y: 70,
    },
    giraffe: {
      x: 90,
      y: 70,
    },
    monkey: {
      x: 275,
      y: 70,
    },
    lion: {
      x: 400,
      y: 70,
    },
  }

  var outlines = {
    snake_black: {
      x: 275,
      y: 350,
    },
    giraffe_black: {
      x: 390,
      y: 250,
    },
    monkey_black: {
      x: 300,
      y: 420,
    },
    lion_black: {
      x: 100,
      y: 390,
    },
  }

  // create draggable animals
  for (var key in animals) {
    // anonymous function to induce scope
    ;(function () {
      var privKey = key
      var anim = animals[key]

      var animal = new Konva.Image({
        image: images[key],
        x: anim.x,
        y: anim.y,
        draggable: true,
      })

      animal.on('dragstart', function () {
        this.moveToTop()
      })
      /*
       * check if animal is in the right spot and
       * snap into place if it is
       */
      animal.on('dragend', function () {
        var outline = outlines[privKey + '_black']
        if (!animal.inRightPlace && isNearOutline(animal, outline)) {
          animal.position({
            x: outline.x,
            y: outline.y,
          })
          animal.inRightPlace = true

          if (++score >= 1) {
            // show background
            var text = 'You win! Enjoy your booty!'
            drawBackground(background, images.beach, text)
          }

          // disable drag and drop
          setTimeout(function () {
            animal.draggable(false)
          }, 50)
        }
      })
      // make animal glow on mouseover
      animal.on('mouseover', function () {
        animal.image(images[privKey + '_glow'])
        document.body.style.cursor = 'pointer'
      })
      // return animal on mouseout
      animal.on('mouseout', function () {
        animal.image(images[privKey])
        document.body.style.cursor = 'default'
      })

      animal.on('dragmove', function () {
        document.body.style.cursor = 'pointer'
      })

      animalLayer.add(animal)
      animalShapes.push(animal)
    })()
  }

  // create animal outlines
  for (var key in outlines) {
    // anonymous function to induce scope
    ;(function () {
      var imageObj = images[key]
      var out = outlines[key]

      var outline = new Konva.Image({
        image: imageObj,
        x: out.x,
        y: out.y,
      })

      animalLayer.add(outline)
    })()
  }

  stage.add(background)
  stage.add(animalLayer)

  console.log('images', images)
  drawBackground(background, images.beach, 'Ahoy! Put the animals on the beach!')
}