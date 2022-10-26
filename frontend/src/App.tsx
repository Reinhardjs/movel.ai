import { Palette } from "./components/Palette";
import { Canvas } from "./core/Canvas";
import { PropertiesPanel } from "./components/PropertiesPanel";

function App() {
  return (
    <div className="app">
      <Palette />
      <Canvas />
      <PropertiesPanel />
    </div>
  );
}

export default App;
