import '/assets/global.css'
import { ThreeUtil } from './utils/ThreeUtils'
import AngryFbx from './assets/models/fbx/Angry.fbx'
import StrutWalkingFbx from './assets/models/fbx/Strut Walking.fbx'
import imgUrl from './assets/img/ikun.jpeg'

const three = new ThreeUtil()

three
  .rendererShadowEnabled()
  .planeGeo(
    {
      width: 10,
      height: 10,
      options: {
        color: 0xffffff,
        map: three.$textureLoader.load(imgUrl)
      }
    },
    (ctx, mesh) => {
      mesh.rotation.x = -0.5 * Math.PI
      mesh.position.set(0, -0.3, 0)
      mesh.receiveShadow = true
    }
  )
  .ambientLight({ color: 0xffffff, intensity: 0.4 })
  .spotLight(
    { color: 0xffffff, intensity: 1, isLightHelper: false, decay: 1.2 },
    (ctx, light) => {
      light.position.set(0, 2, 0)
      light.target.position.set(0, 0, 0)
      light.angle = Math.PI / 4
      light.distance = 100
    }
  )
  .pointLight(
    { color: 0xffffff, intensity: 1, isLightHelper: false },
    (ctx, light) => {
      light.position.set(0, 0, 0)
      light.distance = 1000
    }
  )
  .controls()
  .render()

let index = -1
for (let i = -3; i < 6; i++) {
  // for (let i = 0; i < 1; i++) {
  const width = 0.4
  three.boxGeo(
    {
      width: width,
      height: width,
      depth: width,
      options: {
        color: 0xff0000,
        map: three.$textureLoader.load(imgUrl)
      },
      castShadow: true
    },
    (ctx, mesh) => {
      if (i % 3 === 0) {
        index = -1
      }

      mesh.position.x = 1 * index
      mesh.position.z = Math.floor(i / 3) * 1
      index++

      ctx.requestAnimationFrame(() => {
        // 返回已经过去的时间, 以秒为单位
        const elapsedTime = ctx.$clock.getElapsedTime()
        // 两秒自转一圈
        mesh.rotation.y = elapsedTime * Math.PI
      })

      // let flag = false
      // window.addEventListener('keydown', async (event) => {
      //   if (flag) return
      //   flag = true

      //   const z = mesh.position.z
      //   const x = mesh.position.x

      //   const keyMap = {
      //     KeyW() {
      //       return ctx.animate(z, z - width, 500, (v) => {
      //         mesh.position.z = v
      //       })
      //     },
      //     KeyS() {
      //       return ctx.animate(z, z + width, 500, (v) => {
      //         mesh.position.z = v
      //       })
      //     },
      //     KeyA() {
      //       return ctx.animate(x, x - width, 500, (v) => {
      //         mesh.position.x = v
      //       })
      //     },
      //     KeyD() {
      //       return ctx.animate(x, x + width, 500, (v) => {
      //         mesh.position.x = v
      //       })
      //     }
      //   }

      //   const code = event.code as keyof typeof keyMap
      //   if (keyMap[code]) {
      //     await keyMap[code]()
      //   }
      //   flag = false
      // })
    }
  )
}

void (async () => {
  const angryFbx = await three.fbxLoader(AngryFbx).then((fbx) => {
    fbx.model.position.set(0, 0, 0)
    fbx.model.rotation.set(0, Math.PI, 0) // 旋转模型，如果需要的话
    fbx.model.scale.set(0.01, 0.01, 0.01)
    fbx.model.castShadow = true
    fbx.model.receiveShadow = true
    fbx.model.visible = true
    fbx.play()

    return fbx
  })

  const walkingFbx = await three.fbxLoader(StrutWalkingFbx).then((fbx) => {
    fbx.model.position.set(0, 0, 0)
    fbx.model.rotation.set(0, Math.PI, 0) // 旋转模型，如果需要的话
    fbx.model.scale.set(0.01, 0.01, 0.01)
    fbx.model.castShadow = true
    fbx.model.receiveShadow = true
    fbx.model.visible = false

    return fbx
  })

  three.requestAnimationFrame(() => {
    walkingFbx.mixer.update(0.02)
    angryFbx.mixer.update(0.02)
  })

  let flag = false
  let isUp = true
  window.addEventListener('keydown', async (event) => {
    if (flag) return
    flag = true

    const width = 1
    const z = walkingFbx.model.position.z
    const x = walkingFbx.model.position.x
    const keyMap = {
      KeyW() {
        return three.animate(z, z - width, 1500, (v) => {
          if (!isUp) {
            walkingFbx.model.position.z = v
            angryFbx.model.position.z = v
          }
        })
      },
      KeyS() {
        return three.animate(z, z + width, 1500, (v) => {
          if (!isUp) {
            walkingFbx.model.position.z = v
            angryFbx.model.position.z = v
          }
        })
      },
      KeyA() {
        return three.animate(x, x - width, 1500, (v) => {
          if (!isUp) {
            walkingFbx.model.position.x = v
            angryFbx.model.position.x = v
          }
        })
      },
      KeyD() {
        return three.animate(x, x + width, 1500, (v) => {
          if (!isUp) {
            walkingFbx.model.position.x = v
            angryFbx.model.position.x = v
          }
        })
      }
    }

    const code = event.code as keyof typeof keyMap
    if (keyMap[code]) {
      isUp = false

      angryFbx.model.visible = false
      angryFbx.stop()

      walkingFbx.model.visible = true
      walkingFbx.play()

      await keyMap[code]()
    }
    flag = false
  })

  window.addEventListener('keyup', async (event) => {
    if (['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(event.code)) {
      angryFbx.model.visible = true
      angryFbx.play()

      walkingFbx.model.visible = false
      walkingFbx.stop()

      isUp = true
      flag = false
    }
  })
})()
