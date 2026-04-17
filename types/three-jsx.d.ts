/* eslint-disable @typescript-eslint/no-namespace */
import type { Object3DNode, MaterialNode } from '@react-three/fiber';
import type * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Geometries
      bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
      bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>;

      // Objects
      points: Object3DNode<THREE.Points, typeof THREE.Points>;
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      sprite: Object3DNode<THREE.Sprite, typeof THREE.Sprite>;

      // Materials
      pointsMaterial: MaterialNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
      meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
      meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      meshPhongMaterial: MaterialNode<THREE.MeshPhongMaterial, typeof THREE.MeshPhongMaterial>;
      meshLambertMaterial: MaterialNode<THREE.MeshLambertMaterial, typeof THREE.MeshLambertMaterial>;
      spriteMaterial: MaterialNode<THREE.SpriteMaterial, typeof THREE.SpriteMaterial>;

      // Lights
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
    }
  }
}

export {};
