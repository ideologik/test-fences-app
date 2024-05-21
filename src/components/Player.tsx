import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Box } from "@react-three/drei";

interface PlayerProps {
  position: React.MutableRefObject<[number, number, number]>;
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [isJumping, setIsJumping] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.set(
        position.current[0],
        position.current[1],
        position.current[2]
      );

      // para que la camara siga al jugador
      state.camera.position.lerp(
        new THREE.Vector3(
          ref.current.position.x,
          ref.current.position.y + 5,
          ref.current.position.z + 10
        ),
        0.1
      );
      state.camera.lookAt(ref.current.position);

      if (isJumping && position.current[1] > 1) {
        position.current[1] -= 0.1; // Efecto de gravedad
      } else if (position.current[1] <= 1) {
        setIsJumping(false);
      }
    }
  });

  const handleJump = () => {
    if (!isJumping) {
      setIsJumping(true);
      position.current[1] += 2; // alrededor de 2 metros del salto
    }
    console.log("Jump: Position:", position.current);
  };

  return (
    <Box ref={ref} args={[1, 1, 1]} onClick={handleJump}>
      <meshStandardMaterial color="blue" />
    </Box>
  );
};

export default Player;
