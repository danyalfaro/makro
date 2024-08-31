"use client";

import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { ArchitectureData, Context, Node, NodeType } from "../types/context";

export const NodeContext = createContext<ArchitectureData | null>(null);

export default function NodeContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [data, setData] = useState<Context[]>([
    {
      id: "initialContext",
      label: "Name of the Project",
      type: NodeType.CONTEXT,
      children: [
        {
          id: "container1",
          label: "Container 1",
          type: NodeType.CONTAINER,
          children: [
            {
              id: "usersComponent",
              label: "Users",
              type: NodeType.COMPONENT,
              children: [
                { label: "Desktop", id: "desktopCode", type: NodeType.CODE },
                { label: "Tablet", id: "tabletCode", type: NodeType.CODE },
                { label: "Mobile", id: "mobileCode", type: NodeType.CODE },
              ],
            },
          ],
        },
        {
          label: "Container 2",
          id: "container2",
          type: NodeType.CONTAINER,
          children: [
            {
              label: "Front End",
              id: "frontEndComponent",
              type: NodeType.COMPONENT,
              children: [
                { label: "React", id: "reactCode", type: NodeType.CODE },
              ],
            },
          ],
        },
        {
          label: "Container 3",
          id: "container3",
          type: NodeType.CONTAINER,
          children: [
            {
              label: "Back End",
              id: "backEndComponent",
              type: NodeType.COMPONENT,
              children: [{ label: "API", id: "apiCode", type: NodeType.CODE }],
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    console.log("Modified!!!", data);
  }, [data]);

  // const findNode = (nodeId: string): { node: Node | null; path: string } => {
  //   if (data.id === nodeId) return { node: data, path: "initialContext" };
  //   const match = null;
  //   return { node: match, path: "" };
  // };

  const addNode = (parentId: string, node: Node) => {
    console.log("Adding node -------------> ", parentId, node);
    // const { node: match, path } = findNode(parentId);
    let newNodes = [...data];
    newNodes.forEach((context) => {
      if (context.id === parentId && node.type === NodeType.CONTAINER) {
        console.log("Found Parent -------------> ", context.id);
        context.children.push(node);
      }
      context.children.forEach((container) => {
        if (container.id === parentId && node.type === NodeType.COMPONENT) {
          console.log("Found Parent -------------> ", container.id);
          container.children.push(node);
        }
        container.children.forEach((component) => {
          if (component.id === parentId && node.type === NodeType.CODE) {
            console.log("Found Parent -------------> ", component.id);
            component.children.push(node);
          }
        });
      });
    });

    console.log("Data: ", data);
    console.log("NewNodes: ", newNodes);
    setData(newNodes);
  };
  const removeNode = () => {};
  const editNode = () => {};

  return (
    <NodeContext.Provider value={{ data, addNode, removeNode, editNode }}>
      {children}
    </NodeContext.Provider>
  );
}

export const useNodeContext = () => useContext(NodeContext);
