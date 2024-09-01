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

  const addNode = (parentId: string, node: Node) => {
    let newNodes = [...data];
    newNodes.forEach((context) => {
      if (context.id === parentId && node.type === NodeType.CONTAINER) {
        context.children.push(node);
      }
      context.children.forEach((container) => {
        if (container.id === parentId && node.type === NodeType.COMPONENT) {
          container.children.push(node);
        }
        container.children.forEach((component) => {
          if (component.id === parentId && node.type === NodeType.CODE) {
            component.children.push(node);
          }
        });
      });
    });
    setData(newNodes);
  };
  const removeNode = (node: Node) => {
    let newNodes = [...data];
    newNodes.forEach((context) => {
      context.children.forEach((container) => {
        if (container.id === node.id && node.type === NodeType.CONTAINER) {
          const index = context.children.indexOf(container);
          if (index > -1) {
            context.children.splice(index, 1);
          }
        }
        container.children.forEach((component) => {
          if (component.id === node.id && node.type === NodeType.COMPONENT) {
            const index = container.children.indexOf(component);
            if (index > -1) {
              container.children.splice(index, 1);
            }
          }
          component.children.forEach((code) => {
            if (code.id === node.id && node.type === NodeType.CODE) {
              const index = component.children.indexOf(code);
              if (index > -1) {
                component.children.splice(index, 1);
              }
            }
          });
        });
      });
    });
    setData(newNodes);
  };
  const editNode = () => {};

  return (
    <NodeContext.Provider value={{ data, addNode, removeNode, editNode }}>
      {children}
    </NodeContext.Provider>
  );
}

export const useNodeContext = () => useContext(NodeContext);
