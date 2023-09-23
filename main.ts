import '/assets/global.css'
import { ThreeUtil } from './utils/ThreeUtils'

const three = new ThreeUtil()
const imgUrl = new URL('./assets/img/ikun.jpeg', import.meta.url).href

three
  // .axis(5)
  .rendererShadowEnabled()

let index = -1
// for (let i = -3; i < 6; i++) {
for (let i = 0; i < 1; i++) {
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
      let flag = false
      window.addEventListener('keydown', async (event) => {
        if (flag) return
        flag = true

        const z = mesh.position.z
        const x = mesh.position.x

        const keyMap = {
          KeyW() {
            return ctx.animate(z, z - width, 500, (v) => {
              mesh.position.z = v
            })
          },
          KeyS() {
            return ctx.animate(z, z + width, 500, (v) => {
              mesh.position.z = v
            })
          },
          KeyA() {
            return ctx.animate(x, x - width, 500, (v) => {
              mesh.position.x = v
            })
          },
          KeyD() {
            return ctx.animate(x, x + width, 500, (v) => {
              mesh.position.x = v
            })
          }
        }

        const code = event.code as keyof typeof keyMap
        if (keyMap[code]) {
          await keyMap[code]()
        }
        flag = false
      })

      if (i % 3 === 0) {
        index = -1
      }

      mesh.position.x = 1 * index
      mesh.position.z = Math.floor(i / 3) * 1
      index++

      const animate = () => {
        requestAnimationFrame(animate)
        // 返回已经过去的时间, 以秒为单位
        const elapsedTime = ctx.$clock.getElapsedTime()
        // 两秒自转一圈
        mesh.rotation.y = elapsedTime * Math.PI
      }
      animate()
    }
  )
}

three
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
  // .directionalLight(
  //   { color: 0xffffff, intensity: 1, isLightHelper: true },
  //   (ctx, light) => {
  //     light.position.set(30, 5, 30)
  //   }
  // )
  .spotLight(
    { color: 0xffffff, intensity: 1, isLightHelper: false, decay: 1.2 },
    (ctx, light) => {
      light.position.set(0, 2, 0)
      light.target.position.set(0, 0, 0)
      light.castShadow = true
      light.angle = Math.PI / 4
      light.distance = 100
      // light.shadow.mapSize.width = 512
      // light.shadow.mapSize.height = 512
      // light.shadow.camera.near = 0.5
      // light.shadow.camera.far = 500
    }
  )
  .pointLight(
    { color: 0xffffff, intensity: 1, isLightHelper: false },
    (ctx, light) => {
      light.position.set(0, 0, 0)
      light.castShadow = true
      light.distance = 1000
      // light.shadow.mapSize.width = 512
      // light.shadow.mapSize.height = 512
      // light.shadow.camera.near = 0.5
      // light.shadow.camera.far = 500
    }
  )
  .controls()
  .render()
