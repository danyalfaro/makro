"use client";
import { createContext, ReactElement, useContext, useState } from "react";
import { ContextJSON, Nodes } from "../types/context";

export const NodeContext = createContext<ContextJSON | null>(null);

export default function NodeContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [data, setData] = useState<Nodes>({
    id: "initialContext",
    label: "Name of the Project",
    children: [
      {
        id: "container1",
        label: "Container 1",
        children: [
          {
            id: "usersComponent",
            label: "Users",
            children: [
              { label: "Desktop", id: "desktopCode" },
              { label: "Mobile", id: "mobileCode" },
            ],
          },
        ],
      },
      {
        label: "Container 2",
        id: "container2",
        children: [
          {
            label: "Front End",
            id: "frontEndComponent",
            children: [
              { label: "Desktop", id: "desktopCode" },
              { label: "Mobile", id: "mobileCode" },
            ],
          },
        ],
      },
      {
        label: "Container 3",
        id: "container3",
        children: [
          {
            label: "Back End",
            id: "backEndComponent",
            children: [
              { label: "Desktop", id: "desktopCode" },
              { label: "Mobile", id: "mobileCode" },
            ],
          },
        ],
      },
    ],
  });
  const addNode = () => {};
  const removeNode = () => {};
  const editNode = () => {};

  return (
    <NodeContext.Provider value={{ data, addNode, removeNode, editNode }}>
      {children}
    </NodeContext.Provider>
  );
}

export const useNodeContext = () => useContext(NodeContext);
