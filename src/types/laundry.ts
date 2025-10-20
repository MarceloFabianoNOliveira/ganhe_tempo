
export interface Laundry {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LaundryFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
  logo?: string;
  status: string;
}
