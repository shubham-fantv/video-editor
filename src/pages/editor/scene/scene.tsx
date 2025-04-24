import { Player } from "../player";
import Viewer from "@interactify/infinite-viewer";
import { useEffect, useRef } from "react";
import useStore from "@/pages/editor/store/use-store";
import StateManager from "@designcombo/state";
import SceneEmpty from "./empty";
import Board from "./board";
import useZoom from "../hooks/use-zoom";
import { SceneInteractions } from "./interactions";

export default function Scene({ stateManager }: { stateManager: StateManager }) {
  const viewerRef = useRef<Viewer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { size, trackItemIds } = useStore();
  console.log("🚀 ~ Scene ~ trackItemIds:", trackItemIds, size);
  const { zoom, handlePinch } = useZoom(containerRef, viewerRef, size);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (viewer) {
      const container = viewer.getContainer?.();

      const preventScroll = (e: WheelEvent | TouchEvent) => {
        e.preventDefault();
      };

      if (container) {
        container.addEventListener("wheel", preventScroll, { passive: false });
        container.addEventListener("touchmove", preventScroll, { passive: false });
      }

      return () => {
        if (container) {
          container.removeEventListener("wheel", preventScroll);
          container.removeEventListener("touchmove", preventScroll);
        }
      };
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        flex: 1,
      }}
      ref={containerRef}
    >
      {trackItemIds.length === 0 && <SceneEmpty />}
      <Viewer
        ref={viewerRef}
        className="player-container bg-scene overflow-hidden"
        displayHorizontalScroll={false}
        displayVerticalScroll={false}
        zoom={zoom}
        usePinch={true}
        pinchThreshold={50}
        onPinch={handlePinch}
      >
        <Board size={size}>
          <Player />
          <SceneInteractions
            stateManager={stateManager}
            viewerRef={viewerRef}
            containerRef={containerRef}
            zoom={zoom}
            size={size}
          />
        </Board>
      </Viewer>
    </div>
  );
}
