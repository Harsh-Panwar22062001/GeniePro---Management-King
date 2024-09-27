import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function CartoonBear(props) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, './custom.glb');

  useFrame((state, delta) => {
    // You can animate the model here, if needed
    // For example: group.current.rotation.y += delta;
  });

  return (
    <group ref={group} {...props}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export function AvatarScene() {
  return (
    <Canvas style={{ height: '400px', width: '100%', background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)' }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Suspense fallback={<LoadingFallback />}>
        <CartoonBear position={[0, -1, 0]} scale={[0.8, 0.8, 0.8]} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  );
}