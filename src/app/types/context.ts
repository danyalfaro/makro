export type Code = {
  type: NodeType.CODE;
  id: string;
  label: string;
};

export type Component = {
  type: NodeType.COMPONENT;
  id: string;
  label: string;
  children: Code[];
};

export type Container = {
  type: NodeType.CONTAINER;
  id: string;
  label: string;
  children: Component[];
};

export type Context = {
  type: NodeType.CONTEXT;
  id: string;
  label: string;
  children: Container[];
};

export enum NodeType {
  CONTAINER = "CONTAINER",
  COMPONENT = "COMPONENT",
  CODE = "CODE",
  CONTEXT = "CONTEXT",
}

export type ArchitectureData = {
  data: Context[];
  addNode: any;
  removeNode: any;
  editNode: any;
  isLoading: boolean;
};

export type Node = Context | Container | Component | Code;
