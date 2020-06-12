import { Subscription, Reducer, Effect } from 'umi';

import { querySystemParamConfigs, queryAllMerchants, queryAllBanks } from '@/services/global';
import { GETSYSTEMPARAMCONFIGS, GETALLMERCHANTS, GETALLBANKS } from '@/constants/global';
import { NoticeIconData } from '@/components/NoticeIcon';
import { queryNotices } from '@/services/user';
import { ConnectState } from './connect.d';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface SystemParamConfigs {
  thirdParty: object[];
  paymentChannel: object[];
  licensePlateWay: object[];
  devices: object[];
  oils: object[];
  businessType: object[];
}

export interface GlobalModelState {
  systemParamConfigs: SystemParamConfigs;
  merchants: object[];
  banks: object[];
  collapsed: boolean;
  notices: NoticeItem[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchSystemParamConfigs: Effect;
    fetchMerchants: Effect;
    fetchBanks: Effect;
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
  };
  reducers: {
    GETSYSTEMPARAMCONFIGS: Reducer;
    GETALLMERCHANTS: Reducer;
    GETALLBANKS: Reducer;
    changeLayoutCollapsed: Reducer;
    saveNotices: Reducer;
    saveClearedNotices: Reducer;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    systemParamConfigs: {
      thirdParty: [],
      paymentChannel: [],
      licensePlateWay: [],
      devices: [],
      oils: [],
      businessType: [],
    },
    merchants: [],
    banks: [],
    collapsed: false,
    notices: [],
  },

  effects: {
    *fetchSystemParamConfigs({ payload }, { call, put }) {
      const response = yield call(querySystemParamConfigs, payload);

      const { type } = payload;
      const systemParamConfigs: SystemParamConfigs = {};

      if (type === 0) {
        systemParamConfigs.thirdParty = response;
      }
      if (type === 1) {
        systemParamConfigs.paymentChannel = response;
      }
      if (type === 2) {
        systemParamConfigs.licensePlateWay = response;
      }
      if (type === 3) {
        systemParamConfigs.devices = response;
      }
      if (type === 4) {
        systemParamConfigs.oils = response;
      }
      if (type === 6) {
        systemParamConfigs.businessType = response;
      }

      yield put({
        type: GETSYSTEMPARAMCONFIGS,
        payload: response,
      });
    },
    *fetchMerchants({ payload }, { call, put }) {
      const response = yield call(queryAllMerchants, payload);
      yield put({
        type: GETALLMERCHANTS,
        payload: response,
      });
    },
    *fetchBanks(_, { call, put }) {
      const response = yield call(queryAllBanks);
      yield put({
        type: GETALLBANKS,
        payload: response,
      });
    },
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
  },

  reducers: {
    GETSYSTEMPARAMCONFIGS(state, { payload }) {
      return {
        ...state,
        systemParamConfigs: payload,
      };
    },
    GETALLMERCHANTS(state, { payload }) {
      return {
        ...state,
        merchants: payload,
      };
    },
    GETALLBANKS(state, { payload }) {
      return {
        ...state,
        banks: payload,
      };
    },
    changeLayoutCollapsed(state = { notices: [], collapsed: true }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state = { notices: [], collapsed: true }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
