import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const DEFAULT_CARD_FRONT_URL = '/cards/wsu_card_front.png';
const DEFAULT_CARD_BACK_URL = '/cards/wsu_card_back.png';

const COLOR_DEEP = 0x143a5a;
const COLOR_MID = 0x35678c;
const COLOR_BRIGHT = 0x4c7a9e;
const COLOR_EDGE = 0x173f35;

const CARD_HEIGHT = 0.66;
const CARD_ASPECT = 1.6;
const CARD_DEPTH = 0.009;
const CARD_CORNER_RADIUS = 0.06;
const DRAG_SENSITIVITY = 0.012;
const IDLE_SPIN_SPEED = 0.18;
const FLOAT_AMP = 0.012;
const FLOAT_SPEED = 0.55;

const SPIN_AXIS = new THREE.Vector3(0.16, 1, 0.09).normalize();

const HOME_QUAT = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(
    THREE.MathUtils.degToRad(-7),
    THREE.MathUtils.degToRad(14),
    THREE.MathUtils.degToRad(5),
    'YXZ',
  ),
);

const _spinQuat = new THREE.Quaternion();
const _finalQuat = new THREE.Quaternion();
const _spinArm = new THREE.Vector3(0, 0.22, 0.06);
const _spinTangent = new THREE.Vector3();

class KnightSceneController {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      cardFrontUrl: options.cardFrontUrl ?? DEFAULT_CARD_FRONT_URL,
      cardBackUrl: options.cardBackUrl ?? DEFAULT_CARD_BACK_URL,
      bloomStrength: options.bloomStrength ?? 0.42,
      bloomRadius: options.bloomRadius ?? 0.55,
      dof: options.dof ?? true,
      antialias: options.antialias ?? true,
      powerPreference: options.powerPreference ?? 'high-performance',
      useComposer: options.useComposer !== undefined ? options.useComposer : true,
      ...options,
    };

    this._homeY = 0.42;
    this._isDragging = false;
    this._lastPointerX = 0;
    this._lastPointerY = 0;
    this._userAngle = 0;
    this._idleAngle = 0;
    this._spinScreenDir = new THREE.Vector2(0, 1);
    this._lastFrameTime = performance.now() * 0.001;
    this._elapsedTime = 0;
    this._disposed = false;
    this.knight = null;
    this._cardTextures = [];

    this.scene = createScene();
    this.camera = createCamera();
    this.renderer = createRenderer(canvas, this.options);
    this.lights = setupLights(this.scene);
    this._env = setupEnvironment(this.renderer, this.scene);
    this.composer = this.options.useComposer
      ? setupPostProcessing(this.renderer, this.scene, this.camera, this.options)
      : null;
    setupInteraction(this);

    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
    this.resize();

    this._bootstrap();
  }

  async _bootstrap() {
    try {
      const { group, textures } = await createCardModel(this.options);
      this.knight = group;
      this._cardTextures = textures;
      if (this._disposed) {
        disposeObject3D(group);
        disposeTextures(textures);
        return;
      }

      this.scene.add(this.knight);
      updateSpinScreenDirection(this);
      this._raf = requestAnimationFrame(() => animationLoop(this));
    } catch (error) {
      console.error('KnightScene: failed to load knight model', error);
    }
  }

  resize() {
    const width = this.canvas.clientWidth || this.canvas.width;
    const height = this.canvas.clientHeight || this.canvas.height;

    if (width === 0 || height === 0) {
      return;
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (this.composer) this.composer.setSize(width, height);

    const pixelRatio = this.options.pixelRatio;
    this.renderer.setPixelRatio(pixelRatio);
    if (this.composer) this.composer.setPixelRatio(pixelRatio);
    updateSpinScreenDirection(this);
  }

  dispose() {
    this._disposed = true;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);

    disposeObject3D(this.knight);
    disposeTextures(this._cardTextures);
    this.renderer.dispose();
    if (this.composer) this.composer.dispose();
    this._env?.dispose?.();
    this.lights.forEach((light) => light.dispose?.());
  }
}

function createScene() {
  const scene = new THREE.Scene();
  scene.background = null;
  return scene;
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(1.45, 0.42, 0.05);
  camera.lookAt(0, 0.42, 0);
  return camera;
}

function createRenderer(canvas, options = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: options.antialias !== undefined ? options.antialias : true,
    powerPreference: options.powerPreference ?? 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = false;
  return renderer;
}

async function createCardModel(options = {}) {
  const frontTexture = await loadCardTexture(options.cardFrontUrl);
  const backTexture = await loadCardTexture(options.cardBackUrl);

  const width = CARD_HEIGHT * CARD_ASPECT;
  const shape = createRoundedRectShape(width, CARD_HEIGHT, CARD_CORNER_RADIUS);
  const body = createCardBody(shape);
  const frontFace = createCardFace(shape, frontTexture, CARD_DEPTH * 0.52);
  const backFace = createCardFace(shape, backTexture, -CARD_DEPTH * 0.52, Math.PI);

  const group = new THREE.Group();
  group.add(body, frontFace, backFace);
  group.position.y = CARD_HEIGHT * 0.5;
  group.rotation.x = THREE.MathUtils.degToRad(-4);

  return {
    group,
    textures: [frontTexture, backTexture],
  };
}

function loadCardTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });
}

function createRoundedRectShape(width, height, radius) {
  const x = -width * 0.5;
  const y = -height * 0.5;
  const r = Math.min(radius, width * 0.2, height * 0.2);
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function createCardBody(shape) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: CARD_DEPTH,
    bevelEnabled: false,
    curveSegments: 18,
    steps: 1,
  });
  geometry.translate(0, 0, -CARD_DEPTH * 0.5);

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLOR_EDGE),
    metalness: 0.14,
    roughness: 0.52,
    clearcoat: 0.24,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.9,
  });

  return new THREE.Mesh(geometry, material);
}

function createCardFace(shape, texture, zOffset, rotationY = 0) {
  const geometry = new THREE.ShapeGeometry(shape, 18);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const width = CARD_HEIGHT * CARD_ASPECT;

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    uv.setXY(index, (x + width * 0.5) / width, (y + CARD_HEIGHT * 0.5) / CARD_HEIGHT);
  }

  const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    metalness: 0.03,
    roughness: 0.58,
    clearcoat: 0.68,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.05,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = zOffset;
  mesh.rotation.y = rotationY;
  return mesh;
}

function disposeObject3D(object) {
  if (!object) return;
  object.traverse((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material?.dispose?.());
      return;
    }
    child.material?.dispose?.();
  });
}

function disposeTextures(textures = []) {
  textures.forEach((texture) => texture?.dispose?.());
}

function setupLights(scene) {
  const lights = [];

  const key = new THREE.DirectionalLight(0xb8d4e8, 2.1);
  key.position.set(2.5, 4.5, 3.8);
  scene.add(key);
  lights.push(key);

  const rim = new THREE.DirectionalLight(COLOR_BRIGHT, 3.2);
  rim.position.set(-4.5, 2.2, -2.8);
  scene.add(rim);
  lights.push(rim);

  const rimBack = new THREE.DirectionalLight(0x6a9ab8, 1.5);
  rimBack.position.set(0.2, 1.8, -5.5);
  scene.add(rimBack);
  lights.push(rimBack);

  const fill = new THREE.HemisphereLight(COLOR_BRIGHT, COLOR_DEEP, 0.3);
  scene.add(fill);
  lights.push(fill);

  const soft = new THREE.AmbientLight(COLOR_MID, 0.07);
  scene.add(soft);
  lights.push(soft);

  return lights;
}

function setupEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const environment = new RoomEnvironment();
  const envMap = pmrem.fromScene(environment, 0.04).texture;
  scene.environment = envMap;
  environment.dispose();
  pmrem.dispose();
  return envMap;
}

function setupPostProcessing(renderer, scene, camera, options) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(1, 1),
    options.bloomStrength,
    options.bloomRadius,
    0.82,
  );
  composer.addPass(bloom);

  if (options.dof) {
    const bokeh = new BokehPass(scene, camera, {
      focus: 1.55,
      aperture: 0.00022,
      maxblur: 0.002,
      width: 1,
      height: 1,
    });
    composer.addPass(bokeh);
  }

  const chromaticShader = {
    uniforms: {
      tDiffuse: { value: null },
      offset: { value: 0.00022 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform float offset;
      varying vec2 vUv;
      void main() {
        vec2 dir = vUv - 0.5;
        float dist = length(dir);
        vec2 o = normalize(dir) * offset * dist;
        float r = texture2D(tDiffuse, vUv + o).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, vUv - o).b;
        float a = texture2D(tDiffuse, vUv).a;
        gl_FragColor = vec4(r, g, b, a);
      }
    `,
  };
  composer.addPass(new ShaderPass(chromaticShader));

  return composer;
}

function updateSpinScreenDirection(ctx) {
  const rect = ctx.canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  if (!width || !height) {
    return;
  }

  _spinTangent.crossVectors(SPIN_AXIS, _spinArm).normalize();
  _spinTangent.transformDirection(ctx.camera.matrixWorldInverse);

  const pixelDx = _spinTangent.x * width;
  const pixelDy = -_spinTangent.y * height;
  const length = Math.hypot(pixelDx, pixelDy);

  if (length < 1e-5) {
    ctx._spinScreenDir.set(0, 1);
    return;
  }

  ctx._spinScreenDir.set(pixelDx / length, pixelDy / length);
}

function pointerDeltaToSpin(dx, dy, ctx, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scale = DRAG_SENSITIVITY * Math.max(rect.width / 380, 0.75);

  const alongAxis = (dx * ctx._spinScreenDir.x + dy * ctx._spinScreenDir.y) * scale;
  const vertical = dy * scale;

  return alongAxis + vertical;
}

function setupInteraction(ctx) {
  const { canvas } = ctx;

  const onPointerMove = (event) => {
    if (!ctx._isDragging) return;
    event.preventDefault();

    const dx = event.clientX - ctx._lastPointerX;
    const dy = event.clientY - ctx._lastPointerY;
    ctx._lastPointerX = event.clientX;
    ctx._lastPointerY = event.clientY;

    ctx._userAngle += pointerDeltaToSpin(dx, dy, ctx, canvas);
  };

  const endDrag = (event) => {
    if (!ctx._isDragging) return;
    ctx._isDragging = false;
    ctx._idleAngle += ctx._userAngle;
    ctx._userAngle = 0;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    canvas.style.cursor = 'grab';
  };

  ctx._onPointerDown = (event) => {
    if (event.button !== 0) return;
    ctx._isDragging = true;
    updateSpinScreenDirection(ctx);
    ctx._lastPointerX = event.clientX;
    ctx._lastPointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    canvas.style.cursor = 'grabbing';
  };

  ctx._onPointerUp = endDrag;
  ctx._onPointerMove = onPointerMove;

  canvas.addEventListener('pointerdown', ctx._onPointerDown);
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';
}

function animationLoop(ctx) {
  if (ctx._disposed) return;
  ctx._raf = requestAnimationFrame(() => animationLoop(ctx));

  if (!ctx.knight) return;

  const now = performance.now() * 0.001;
  const deltaTime = Math.min(now - ctx._lastFrameTime, 0.05);
  ctx._lastFrameTime = now;
  ctx._elapsedTime += deltaTime;
  const elapsedTime = ctx._elapsedTime;

  updateMotion(ctx, elapsedTime, deltaTime);
  ctx.renderer.render(ctx.scene, ctx.camera);
}

function updateMotion(ctx, elapsedTime, deltaTime) {
  const { knight } = ctx;

  const floatY = ctx._isDragging ? 0 : Math.sin(elapsedTime * FLOAT_SPEED) * FLOAT_AMP;
  knight.position.set(0, ctx._homeY + floatY, 0);

  if (!ctx._isDragging) {
    ctx._idleAngle += deltaTime * IDLE_SPIN_SPEED;
  }

  const totalAngle = ctx._idleAngle + ctx._userAngle;
  _spinQuat.setFromAxisAngle(SPIN_AXIS, totalAngle);
  _finalQuat.copy(_spinQuat).multiply(HOME_QUAT);
  knight.quaternion.copy(_finalQuat);
}

export default function KnightScene() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 639px)');
    const onChange = () => setIsMobile(mq?.matches ?? false);
    if (mq) {
      onChange();
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else mq.addListener(onChange);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', onChange);
        else mq.removeListener(onChange);
      };
    }

    setIsMobile(window.innerWidth <= 639);
    return undefined;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mobileOptions = {
      pixelRatio: Math.min(window.devicePixelRatio, 1),
      bloomStrength: 0.12,
      bloomRadius: 0.25,
      dof: false,
      antialias: false,
      powerPreference: 'low-power',
      useComposer: false,
    };

    const options = isMobile ? mobileOptions : undefined;
    const controller = new KnightSceneController(canvas, options);
    return () => controller.dispose();
  }, [isMobile]);

  // Always render the canvas. On mobile we initialize the controller with
  // lower-cost options so the model still appears but with reduced quality
  // and no expensive post-processing.
  return <canvas ref={canvasRef} className="knight-scene-canvas" />;
}
