"use client";

import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { ArchitectureData, Context, Node, NodeType } from "../types/context";
import { v4 as uuidv4 } from "uuid";

export const NodeContext = createContext<ArchitectureData | null>(null);

export default function NodeContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Context[]>([
    {
      id: uuidv4(),
      label: "Name of the Project",
      type: NodeType.CONTEXT,
      children: [
        {
          id: uuidv4(),
          label: "Container 1",
          type: NodeType.CONTAINER,
          children: [
            {
              id: uuidv4(),
              label: "Users",
              type: NodeType.COMPONENT,
              children: [
                { label: "Desktop", id: uuidv4(), type: NodeType.CODE },
                { label: "Tablet", id: uuidv4(), type: NodeType.CODE },
                { label: "Mobile", id: uuidv4(), type: NodeType.CODE },
              ],
            },
          ],
        },
        {
          label: "Container 2",
          id: uuidv4(),
          type: NodeType.CONTAINER,
          children: [
            {
              label: "Front End",
              id: uuidv4(),
              type: NodeType.COMPONENT,
              children: [
                { label: "React", id: "reactCode", type: NodeType.CODE },
              ],
            },
          ],
        },
        {
          label: "Container 3",
          id: uuidv4(),
          type: NodeType.CONTAINER,
          children: [
            {
              label: "Back End",
              id: uuidv4(),
              type: NodeType.COMPONENT,
              children: [{ label: "API", id: "apiCode", type: NodeType.CODE }],
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    setIsLoading(false);
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
    setIsLoading(true);
    let newNodes = [...data];
    newNodes.forEach((context) => {
      if (context.id === node.id) {
        newNodes = [];
      }
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
  const editNode = (node: Node) => {
    setIsLoading(true);
    let newNodes = [...data];
    newNodes.forEach((context) => {
      if (context.id === node.id) {
        context.label = node.label;
      } else {
        context.children.forEach((container) => {
          if (container.id === node.id && node.type === NodeType.CONTAINER) {
            container.label = node.label;
          }
          container.children.forEach((component) => {
            if (component.id === node.id && node.type === NodeType.COMPONENT) {
              component.label = node.label;
            }
            component.children.forEach((code) => {
              if (code.id === node.id && node.type === NodeType.CODE) {
                code.label = node.label;
              }
            });
          });
        });
      }
    });
    setData(newNodes);
  };

  return (
    <NodeContext.Provider
      value={{ data, isLoading, addNode, removeNode, editNode }}
    >
      {children}
    </NodeContext.Provider>
  );
}

export const useNodeContext = () => useContext(NodeContext);
