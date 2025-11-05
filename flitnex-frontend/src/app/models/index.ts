export interface User {
  id: string;
  email: string;
  age: number;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  age: number;
}

export interface Show {
  show_id: string;
  type: 'movie' | 'tv';
  title: string;
  director: string;
  cast: string[];
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string[];
  description: string;
  // cast: string[];
  // country: string;
  // date_added: string;
  // release_year: number;
  // rating: string;
  // duration: string;
  // listed_in: string[];
  // description: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  totalItems : number
}

export interface ShowFilters {
  page: number;
  perPage: number;
  titleSearch: string;
  castSearch: string;
  type: '' | 'movie' | 'tv';
  [key: string]: string | number | undefined;
}

// export interface ShowFilters {
//   search?: string;
//   type?: 'movie' | 'tv' | '';
//   page: number;
//   perPage: number;
// }
