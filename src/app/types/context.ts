export type Code = {
  id: string;
  label: string;
};

export type Component = {
  id: string;
  label: string;
  children: Code[];
};

export type Container = {
  id: string;
  label: string;
  children: Component[];
};

export type Nodes = {
  id: string;
  label: string;
  children: Container[];
};

export type ContextJSON = {
  data: Nodes;
  addNode: any;
  removeNode: any;
  editNode: any;
};
