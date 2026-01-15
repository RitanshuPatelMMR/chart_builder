export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  plan: 'free' | 'premium';
  status: 'active' | 'inactive' | 'suspended';
  chartsCount: number;
  joinedAt: string;
  avatarUrl?: string;
}

export interface AdminPayment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: 'starter' | 'pro' | 'enterprise';
  amount: number;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
}

export interface AdminMetrics {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  totalCharts: number;
  totalRevenue: number;
}

export interface UserGrowthData {
  period: string;
  users: number;
  charts: number;
}
