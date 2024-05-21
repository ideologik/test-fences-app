import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

type Position = [number, number, number];

const App: React.FC = () => {
  const playerPosition = useRef<Position>([0, 1, 0]);
  const velocity = useRef<Position>([0, 0, 0]);
  const targetPosition = useRef<Position>([0, 1, 0]);
  const speed = 0.1;

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        velocity.current = [0, 0, -speed];
        break;
      case "ArrowDown":
        velocity.current = [0, 0, speed];
        break;
      case "ArrowLeft":
        velocity.current = [-speed, 0, 0];
        break;
      case "ArrowRight":
        velocity.current = [speed, 0, 0];
        break;
      case " ":
        // varra espaciadora para saltar
        if (playerPosition.current[1] <= 1) {
          playerPosition.current[1] += 2;
        }
        break;
      default:
        break;
    }
    console.log("KeyDown:", e.key, "Velocity:", velocity.current);
  };

  const handleKeyUp = () => {
    velocity.current = [0, 0, 0];
    console.log("KeyUp: Velocity reset to", velocity.current);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Canvas>
      <Scene
        playerPosition={playerPosition}
        targetPosition={targetPosition}
        velocity={velocity}
        speed={speed}
      />
    </Canvas>
  );
};

export default App;
