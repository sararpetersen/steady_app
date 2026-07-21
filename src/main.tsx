
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  const isDevGallery = import.meta.env.DEV && window.location.pathname === "/dev/gallery";

  async function mount() {
    if (isDevGallery) {
      const { ComponentGallery } = await import("./app/components/ui/ComponentGallery.tsx");
      createRoot(document.getElementById("root")!).render(<ComponentGallery />);
    } else {
      createRoot(document.getElementById("root")!).render(<App />);
    }
  }

  mount();
  