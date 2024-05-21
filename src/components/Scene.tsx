import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Plane, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import Player from "./Player";
import { useRef } from "react";

type Position = [number, number, number];

interface SceneProps {
  playerPosition: React.MutableRefObject<Position>;
  targetPosition: React.MutableRefObject<Position>;
  velocity: React.MutableRefObject<Position>;
  speed: number;
}

const Scene: React.FC<SceneProps> = ({
  playerPosition,
  targetPosition,
  velocity,
  speed,
}) => {
  const { camera, scene } = useThree();
  const obstacles = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    if (
      !playerPosition.current ||
      !targetPosition.current ||
      !velocity.current
    ) {
      return;
    }

    const [px, py, pz] = playerPosition.current;
    const [vx, , vz] = velocity.current;

    // Calculate new position
    const newX = px + vx;
    const newZ = pz + vz;

    // Check for collisions
    let collision = false;
    for (const obstacle of obstacles.current) {
      const obstacleBox = new THREE.Box3().setFromObject(obstacle);
      if (obstacleBox.containsPoint(new THREE.Vector3(newX, py, newZ))) {
        collision = true;
        break;
      }
    }

    // Update position if no collision
    if (!collision) {
      playerPosition.current[0] = newX;
      playerPosition.current[2] = newZ;
    }

    console.log("Updated Position:", playerPosition.current);
    console.log("Velocity:", velocity.current);

    // Gravity effect
    if (py > 1) {
      playerPosition.current[1] -= 0.1;
    } else {
      playerPosition.current[1] = 1;
    }

    // Move towards the target position if necessary
    const [tx, , tz] = targetPosition.current;
    const dx = tx - px;
    const dz = tz - pz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > speed) {
      playerPosition.current[0] += (dx / dist) * speed;
      playerPosition.current[2] += (dz / dist) * speed;
    }

    // Update the target position to prevent continuous movement
    targetPosition.current = [px, py, pz];
    console.log("Target Position (after):", targetPosition.current);
  });

  const handleClick = (e: any) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { width, height } = e.currentTarget;
    const x = (offsetX / width) * 2 - 1;
    const y = -(offsetY / height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      const [intersect] = intersects;
      targetPosition.current = [
        intersect.point.x,
        playerPosition.current[1],
        intersect.point.z,
      ];
    }
    console.log("HandleClick - Target Position:", targetPosition.current);
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="sunset" />
      <Plane
        onClick={handleClick}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        args={[100, 100]}
      >
        <meshStandardMaterial color="green" />
      </Plane>
      <Player position={playerPosition} />
      <Box
        ref={(ref) => ref && obstacles.current.push(ref)}
        position={[5, 1, 0]}
        args={[2, 2, 2]}
      >
        <meshStandardMaterial color="red" />
      </Box>
      <Box
        ref={(ref) => ref && obstacles.current.push(ref)}
        position={[5, 1, 0]}
        args={[3, 3, 3]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>
      <group position={[0, 0, 5]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Box
            ref={(ref) => ref && obstacles.current.push(ref)}
            key={i}
            position={[0, i * 0.5, i * 2]}
            args={[2, 0.5, 2]}
          >
            <meshStandardMaterial color="brown" />
          </Box>
        ))}
      </group>
    </>
  );
};

export default Scene;
