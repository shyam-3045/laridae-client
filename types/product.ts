export interface Product {
  _id: string;
  name: string;
  Overview: string;
  description: string;
  category: string;
  ratings: number;
  numOfReviews: number;
  packaging: string;
  shellLife: string;
  createdAt: string;
  __v: number;
  reviews: Review[];
  variants: Variant[];
  images: Image[];
  shopFlag:number
}
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number; // e.g. 4.5
  comment: string;
  createdAt: string;
}

export interface Variant {
  weight: string;
  stock: number;
  price: number;
  discountedPrice: number;
  _id: string;
}

export interface Image {
  public_id: string;
  url: string;
  _id: string;
}