import axios from 'axios';

import clientApi from '@/api/client-api';

import type { Tips } from '@/types/tips';

// APIレスポンスの型
type GetTipsApiResponse = {
  status: number;
  message: string;
  tips: {
    status: string;
    message: string;
    tips_list: Tips[];
  };
  error: any;
};

// Tips一覧を取得
export async function getTips(): Promise<Tips[]> {
  try {
    const res = await clientApi.get<GetTipsApiResponse>('/tips/list');

    return res.data.tips.tips_list;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log('=== Axios Network Error ===');
      console.log('message:', err.message);
      console.log('code:', err.code);
      console.log('baseURL:', err.config?.baseURL);
      console.log('url:', err.config?.url);
    } else {
      console.log('Unknown error:', err);
    }
    throw err;
  }
}
