import { Palette } from "./core/Palette";
import { Canvas } from "./core/Canvas";
import { PropertiesPanel } from "./core/PropertiesPanel";

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
