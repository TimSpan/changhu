export interface SecurityMemberType {
  endDate: string | null;
  img: string;
  location: number[];
  name: string;
  remark: string;
  snowFlakeId: string;
  startDate: string;
  projectPostName: string;
}
const SecurityMemberTypeExample = {
  endDate: null,
  img: '',
  location: [112.98521183330729, 28.214017832522764],
  name: '麻园岭小学操场',
  remark: '',
  snowFlakeId: '1963851272314425344',
  startDate: '2025-09-05 00:00:00',
  projectPostName: '',
};

export interface DetailsParam {
  actualCount: number;
  requiredCount: number;
  create_time: string;
  cycle: number;
  endDate: string;
  img: string;
  intervalUnit: Option;
  intervalValue: number;
  location: number[];
  name: string;
  projectId: string;
  projectPostId: string;
  remark: string;
  snowFlakeId: string;
  startDate: string;
  status: Option;
}

const DetailsParamExample = {
  actualCount: 1,
  create_time: null,
  cycle: 1,
  endDate: null,
  img: null,
  intervalUnit: {extData: null, label: '月', value: 'month'},
  extData: null,
  label: '月',
  value: 'month',
  intervalValue: 1,
  location: [112.98521183330729, 28.214017832522764],
  name: '麻园岭小学操场',
  projectId: '1958074034830708736',
  projectPostId: '1958083856921792512',
  remark: '',
  requiredCount: 5,
  snowFlakeId: '1963851272314425344',
  startDate: '2025-09-05 00:00:00',
  status: {extData: {type: 'success'}, label: '启用', value: 'enable'},
};
