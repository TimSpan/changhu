interface Option {
  label: string;
  value: string;
}

interface TokenMessage {
  role: string;
  tokenInfo: TokenInfo;
}

interface TokenInfo {
  isLogin: boolean;
  loginDevice: string;
  loginId: string;
  loginType: string;
  sessionTimeout: string;
  tag: string;
  tokenActiveTimeout: string;
  tokenName: string;
  tokenSessionTimeout: string;
  tokenTimeout: string;
  tokenValue: string;
}

interface MyProject {
  address: string;
  boundary: any[];
  center: any[];
  city: string;
  cityName: string;
  createTime: string;
  district: string;
  districtName: string;
  managerUserId: string;
  managerUserName: string;
  name: string;
  province: string;
  provinceName: string;
  remark: string;
  snowFlakeId: string;
  typeId: string;
  typeName: string;
}
interface JsonResult<T> {
  code: number;
  message: string;
  data: T;
}

interface SubmitData {
  projectId: string;
  sysDictDataId: string;
  remark: string;
  imgList?: any[];
  video?: string;
}
