import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const initThree = (
  callback: (options: {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
  }) => void
) => {
  // 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.pixelRatio = window.devicePixelRatio
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.append(renderer.domElement)

  // 2. 创建场景
  const scene = new THREE.Scene()

  // 3. 创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(5, 5, 10)
  camera.lookAt(0, 0, 0)

  // 4. 创建物体
  callback({ scene, camera, renderer })

  // 5. 渲染
  renderer.render(scene, camera)
}

export class ThreeUtil {
  $renderer: THREE.WebGLRenderer
  $scene: THREE.Scene
  $camera: THREE.PerspectiveCamera
  $clock: THREE.Clock
  $textureLoader: THREE.TextureLoader

  constructor() {
    // 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.pixelRatio = window.devicePixelRatio
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.append(renderer.domElement)

    // 2. 创建场景
    const scene = new THREE.Scene()

    // 3. 创建相机
    const camera = new THREE.PerspectiveCamera(
      7.5,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.set(15, 15, 30)
    camera.lookAt(0, 0, 0)

    this.$renderer = renderer
    this.$camera = camera
    this.$scene = scene
    this.$clock = new THREE.Clock()
    this.$textureLoader = new THREE.TextureLoader()
  }

  render() {
    const animate = () => {
      requestAnimationFrame(animate)
      this.$renderer.render(this.$scene, this.$camera)
    }
    animate()

    return this
  }

  rendererShadowEnabled() {
    this.$renderer.shadowMap.enabled = true

    return this
  }

  axis(size?: number) {
    const axis = new THREE.AxesHelper(size)

    this.$scene.add(axis)

    return this
  }

  boxGeo(
    {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
      options,
      castShadow
    }: {
      width?: number
      height?: number
      depth?: number
      widthSegments?: number
      heightSegments?: number
      depthSegments?: number
      options?: THREE.MeshBasicMaterialParameters
      castShadow?: boolean
    },
    callback?: (ctx: typeof this, mesh: THREE.Mesh) => void
  ) {
    const geometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments
    )
    const material = new THREE.MeshStandardMaterial(options)
    const mesh = new THREE.Mesh(geometry, material)

    mesh.castShadow = !!castShadow

    callback && callback(this, mesh)

    this.$scene.add(mesh)

    return this
  }

  planeGeo(
    {
      width,
      height,
      depth,
      widthSegments,
      options
    }: {
      width?: number
      height?: number
      depth?: number
      widthSegments?: number
      options?: THREE.MeshBasicMaterialParameters
    },
    callback?: (ctx: typeof this, mesh: THREE.Mesh) => void
  ) {
    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      depth,
      widthSegments
    )
    const material = new THREE.MeshStandardMaterial(options)
    const mesh = new THREE.Mesh(geometry, material)

    callback && callback(this, mesh)

    this.$scene.add(mesh)

    return this
  }

  ambientLight(
    {
      color,
      intensity
    }: {
      color?: THREE.ColorRepresentation
      intensity?: number
    },
    callback?: (ctx: typeof this, light: THREE.AmbientLight) => void
  ) {
    const ambientLight = new THREE.AmbientLight(color, intensity)

    callback && callback(this, ambientLight)

    this.$scene.add(ambientLight)

    return this
  }

  directionalLight(
    {
      color,
      intensity,
      isLightHelper
    }: {
      color?: THREE.ColorRepresentation
      intensity?: number
      isLightHelper?: boolean
    },
    callback?: (ctx: typeof this, light: THREE.DirectionalLight) => void
  ) {
    const directionalLight = new THREE.DirectionalLight(color, intensity)

    directionalLight.castShadow = true

    callback && callback(this, directionalLight)

    this.$scene.add(directionalLight)

    // 是否添加辅助线
    if (isLightHelper) {
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight
      )
      this.$scene.add(directionalLightHelper)
    }

    return this
  }

  spotLight(
    {
      color,
      intensity,
      isLightHelper,
      distance,
      angle,
      penumbra,
      decay
    }: {
      color?: THREE.ColorRepresentation
      intensity?: number
      isLightHelper?: boolean
      distance?: number
      angle?: number
      penumbra?: number
      decay?: number
    },
    callback?: (ctx: typeof this, light: THREE.SpotLight) => void
  ) {
    const spotLight = new THREE.SpotLight(
      color,
      intensity,
      distance,
      angle,
      penumbra,
      decay
    )

    spotLight.castShadow = true

    callback && callback(this, spotLight)

    this.$scene.add(spotLight)

    // 是否添加辅助线
    if (isLightHelper) {
      const spotLightHelper = new THREE.SpotLightHelper(spotLight)
      this.$scene.add(spotLightHelper)
    }

    return this
  }

  pointLight(
    {
      color,
      intensity,
      isLightHelper,
      distance,
      angle
    }: {
      color?: THREE.ColorRepresentation
      intensity?: number
      isLightHelper?: boolean
      distance?: number
      angle?: number
    },
    callback?: (ctx: typeof this, light: THREE.PointLight) => void
  ) {
    const pointLight = new THREE.PointLight(color, intensity, distance, angle)

    pointLight.castShadow = true

    callback && callback(this, pointLight)

    this.$scene.add(pointLight)

    // 是否添加辅助线
    if (isLightHelper) {
      const pointLightHelper = new THREE.PointLightHelper(pointLight)
      this.$scene.add(pointLightHelper)
    }

    return this
  }

  animate(
    from: number,
    to: number,
    duration: number,
    callback: (value: number) => void
  ) {
    return new Promise<void>((resolve) => {
      const start = Date.now()
      const s = to - from
      const v = s / duration
      let value = from

      function _run() {
        const now = Date.now()
        const t = now - start
        value += v * t

        callback(value)

        if ((s > 0 && value >= to) || (s < 0 && value <= to)) {
          resolve()
          return
        }

        requestAnimationFrame(_run)
      }

      _run()
    })
  }

  custom(callback: (three: typeof this) => void) {
    callback(this)

    return this
  }

  controls() {
    const controls = new OrbitControls(this.$camera, this.$renderer.domElement)
    controls.update()

    return this
  }
}
