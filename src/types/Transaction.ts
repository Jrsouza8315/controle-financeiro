export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "revenue" | "expense";
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  description: string;
  amount: number;
  type: "revenue" | "expense";
  category_id: string;
}
