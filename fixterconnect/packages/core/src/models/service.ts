export type Service = {
  id: number;
  name: string;
  icon: string;
};

export type ContractorService = Service & {
  selected: boolean;
};