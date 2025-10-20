
export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: string;
  laundryId?: string;
  created_at?: Date;
  authUid?: string;
}

export interface NewUserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  laundryId: string;
}
