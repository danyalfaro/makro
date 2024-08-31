"use client";

import { useNodeContext } from "./components/NodeContext";
import { Container, Component, Code, NodeType } from "./types/context";

export default function Home() {
  const architectureData = useNodeContext();
  const testNode = {
    id: "nativeUsers",
    label: "Native App",
    type: NodeType.COMPONENT,
    children: [{ label: "Mobile", id: "mobileCode", type: NodeType.CODE }],
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={() => {
          architectureData?.addNode("container1", testNode);
        }}
      >
        Add Component
      </button>
      {architectureData && architectureData.data && (
        <div className="flex gap-2">
          {architectureData.data.map((context) =>
            context.children.map((container, index) => (
              <Container container={container} key={`container-${index}`} />
            ))
          )}
        </div>
      )}
    </main>
  );
}

function Container({ container }: { container: Container }) {
  return (
    <div className="bg-green-500 flex flex-col gap-4 p-8">
      <h1>Container</h1>
      <h1>{container.label}</h1>
      {container.children.map((component, index) => (
        <Component component={component} key={`component-${index}`} />
      ))}
    </div>
  );
}

function Component({ component }: { component: Component }) {
  return (
    <div className="bg-blue-500 flex flex-col gap-4 p-8">
      <h1>Component</h1>
      <h1>{component.label}</h1>
      {component.children.map((code, index) => (
        <Code code={code} key={`code-${index}`} />
      ))}
    </div>
  );
}

function Code({ code }: { code: Code }) {
  return (
    <div className="bg-gray-400 flex flex-col gap-4 p-8">
      <h1>Code</h1>
      <h1>{code.label}</h1>
    </div>
  );
}
