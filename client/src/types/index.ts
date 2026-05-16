export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ILeadsResponse {
  success: boolean;
  data: ILead[];
  pagination: IPagination;
}

export interface IAuthResponse {
  success: boolean;
  token: string;
  user: IUser;
}