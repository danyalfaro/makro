"use client";

import { useNodeContext } from "./components/NodeContext";

import Context from "./components/Context";

export default function Home() {
  const architectureData = useNodeContext();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {architectureData &&
        !architectureData.isLoading &&
        architectureData.data && (
          <div>
            {architectureData.data.map((context, index) => (
              <Context context={context} key={`context-${index}`} />
            ))}
          </div>
        )}
      {architectureData?.isLoading && <div>Loading...</div>}
    </main>
  );
}


