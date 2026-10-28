export interface Offer {
  id: string;
  title: string;
  company: string;
  city: string;
  contractType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  url: string;
  createdAt: string;
}
