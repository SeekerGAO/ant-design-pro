import request from '@/utils/request';

/**
 * 查询系统参数配置
 * type: 0-第三方系统; 1-支付通道; 2-获取车牌的途径; 3-操作设备; 4-油品; 6-商家类型
 * @export
 * @param {{ type: number }} params
 * @returnss
 */
export async function querySystemParamConfigs(params: { type: number }) {
  return request('/gas_mini/systemParamConfig/selectSystemParam', {
    method: 'POST',
    data: params,
  });
}

/**
 * 查询全部商家
 *
 * @export
 * @param {{ storeType: string; MerchantName: string; }} [params]
 * @returns
 */
export async function queryAllMerchants(params?: { storeType: string; MerchantName: string }) {
  return request('/gas_mini/advert/getMerchantNameList', {
    method: 'post',
    data: params || { storeType: '', MerchantName: '' },
  });
}

/**
 * 查询所有银行
 *
 * @export
 * @returns
 */
export async function queryAllBanks() {
  return request('/gas_mini/promotion/selectAllBankName');
}
