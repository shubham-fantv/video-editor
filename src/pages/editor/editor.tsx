import Timeline from "./timeline";
import useStore from "./store/use-store";
import Navbar from "./navbar";
import MenuList from "./menu-list";
import { MenuItem } from "./menu-item";
import useTimelineEvents from "@/hooks/use-timeline-events";
import Scene from "./scene";
import StateManager, { DESIGN_LOAD } from "@designcombo/state";
import { ControlItem } from "./control-item";
import ControlList from "./control-list";
import { useEffect, useRef, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { dispatch } from "@designcombo/events";

const stateManager = new StateManager({
  size: {
    width: 1920,
    height: 1080,
  },
  scale: {
    // 1x distance (second 0 to second 5, 5 segments).
    index: 7,
    unit: 300,
    zoom: 1 / 300,
    segments: 5,
  },
});
type Project = {
  id: string;
  fps: number;
  size: {
    width: number;
    height: number;
  };
  tracks: {
    id: string;
    type: string;
    accepts: string[];
    items: string[];
    magnetic: boolean;
    static: boolean;
  }[];
  trackItemDetailsMap: {
    [key: string]: {
      type: string;
      details: any; // You can be more specific here if you want
    };
  };
};

const App = () => {
  const timelinePanelRef = useRef<ImperativePanelHandle>(null);
  const { timeline, playerRef } = useStore();
  const [project, setProject] = useState<Project | null>(null);
  useTimelineEvents();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplate() {
      const url = `https://api.videonation.xyz/api/v1/templates/${window.location.pathname.split("/").pop()}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjhmMzUxMDYzNGUxNzEyODYzMTRlYzgiLCJpYXQiOjE3MzcyMTY2MjIsImV4cCI6MTc2ODc3NDIyMiwidHlwZSI6ImFjY2VzcyJ9.NJureUG2Fkz0y5VKsIYDRXuO09K9Tu78GhncI2Qw1iI",
          },
        });

        const data = await response.json();
        const startingProject = {
          id: "j1LfwJAoR9G3IhjE",
          fps: 30,
          tracks: [
            {
              id: "k5g9E_w1gSC-goCzJK9nB",
              accepts: ["text", "audio", "helper", "video", "image", "caption", "template"],
              type: "video",
              items: ["RZUICjMxa7r3tM8K"],
              magnetic: false,
              static: false,
            },
          ],
          size: {
            width: 1920,
            height: 1080,
          },
          trackItemDetailsMap: {
            RZUICjMxa7r3tM8K: {
              type: "video",
              details: {
                width: 640,
                height: 300,
                opacity: 100,
                src: data.data.videoUrl,
                volume: 100,
                borderRadius: 0,
                borderWidth: 0,
                borderColor: "#000000",
                boxShadow: {
                  color: "#000000",
                  x: 0,
                  y: 0,
                  blur: 0,
                },
                transform: "scale(2)",
                blur: 0,
                brightness: 100,
                flipX: false,
                flipY: false,
                rotate: "0deg",
                visibility: "visible",
              },
              metadata: {
                previewUrl: "https://cdn.designcombo.dev/thumbnails/Happiness-shouldnt-depend.png",
              },
            },
          },
          trackItemIds: ["RZUICjMxa7r3tM8K"],
          transitionsMap: {},
          trackItemsMap: {
            RZUICjMxa7r3tM8K: {
              id: "RZUICjMxa7r3tM8K",
              metadata: {
                previewUrl: "https://cdn.designcombo.dev/thumbnails/Happiness-shouldnt-depend.png",
              },
              trim: {
                from: 0,
                to: 23870.113,
              },
              type: "video",
              name: "video",
              playbackRate: 1,
              display: {
                from: 0,
                to: 23870.113,
              },
              duration: 23870.113,
              isMain: false,
              details: {
                width: 360,
                height: 640,
                opacity: 100,
                src: data.data.videoUrl,
                volume: 100,
                borderRadius: 0,
                borderWidth: 0,
                borderColor: "#000000",
                boxShadow: {
                  color: "#000000",
                  x: 0,
                  y: 0,
                  blur: 0,
                },
                top: "360px",
                left: "640px",
                transform: "scale(3)",
                blur: 0,
                brightness: 100,
                flipX: false,
                flipY: false,
                rotate: "0deg",
                visibility: "visible",
              },
            },
          },
          transitionIds: [],
        };

        setProject(startingProject);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    }

    fetchTemplate();
  }, []);

  useEffect(() => {
    if (!timeline) return;
    dispatch(DESIGN_LOAD, {
      payload: project,
    });
  }, [timeline]);

  useEffect(() => {
    const screenHeight = window.innerHeight;
    const desiredHeight = 300;
    const percentage = (desiredHeight / screenHeight) * 100;
    timelinePanelRef.current?.resize(percentage);
  }, []);

  const handleTimelineResize = () => {
    const timelineContainer = document.getElementById("timeline-container");
    if (!timelineContainer) return;

    timeline?.resize(
      {
        height: timelineContainer.clientHeight - 90,
        width: timelineContainer.clientWidth - 40,
      },
      {
        force: true,
      }
    );
  };

  useEffect(() => {
    const onResize = () => handleTimelineResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [timeline]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <ResizablePanelGroup style={{ height: "100vh" }} direction="vertical">
          <ResizablePanel className="relative" defaultSize={70}>
            <Navbar />
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <MenuList />
              <MenuItem />
              <ControlList />
              <ControlItem />
              <Scene stateManager={stateManager} />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            className="min-h-[50px]"
            ref={timelinePanelRef}
            defaultSize={30}
            onResize={handleTimelineResize}
          >
            {playerRef && <Timeline stateManager={stateManager} />}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
};

export default App;
