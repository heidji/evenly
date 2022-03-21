export type Place = {
  fsq_id: string;
  name: string;
  categories: {
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    }
  }[];
  position: {
    latitude: number;
    longitude: number;
  };
  address: string;
}
