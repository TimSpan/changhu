import React, {useState, ReactNode, useEffect} from 'react';
import ConfirmDialog from './index';

type AlertParams = {
  title: string; // 弹窗标题
  text: string; // 弹窗内容文字
  onlyConfirm?: boolean; // 是否只显示“确认”按钮（true：无取消按钮）
  onConfirm?: () => void; // 点击确认按钮后的回调
  onCancel?: () => void; // 点击取消按钮后的回调
};

// 全局引用，用于在任何地方触发弹窗
let showAlertGlobal: ((params: AlertParams) => void) | null = null;

// ConfirmDialogProvider 组件，用于包裹 App，管理 ConfirmDialog 的状态
export const ConfirmDialogProvider = ({children}: {children: ReactNode}) => {
  const [visible, setVisible] = useState(false); // 控制弹窗显示/隐藏
  const [params, setParams] = useState<AlertParams | null>(null); // 存储当前弹窗参数

  useEffect(() => {
    // 注册全局 showAlert 方法，使外部可以通过 ConfirmAlert.alert 调用
    showAlertGlobal = (p: AlertParams) => {
      setParams(p);
      setVisible(true);
    };
  }, []);

  // 关闭弹窗
  const close = () => setVisible(false);

  return (
    <>
      {children}
      {params && (
        <ConfirmDialog
          visible={visible}
          title={params.title}
          text={params.text}
          onlyConfirm={!!params.onlyConfirm} // 强制转换成布尔值
          // 点击取消按钮
          close={() => {
            close(); // 隐藏弹窗
            params.onCancel?.(); // 执行取消回调（可选）
          }}
          // 点击确认按钮
          confirm={() => {
            close(); // 隐藏弹窗
            params.onConfirm?.(); // 执行确认回调（可选）
          }}
        />
      )}
    </>
  );
};

// 静态 API 模拟原生
export const ConfirmAlert = {
  /**
   * 调用示例：
   * ConfirmAlert.alert('提示', '请输入备注', [
   *   {text: '取消', style: 'cancel', onPress: () => console.log('取消')},
   *   {text: '确定', onPress: () => console.log('确认')}
   * ])
   */
  alert: (
    title: string,
    text: string,
    buttons: {text: string; onPress?: () => void; style?: 'cancel' | 'default'}[] = [
      {text: '确定'}, // 默认按钮
    ],
  ) => {
    // 判断是否只显示一个按钮
    const onlyConfirm = buttons.length === 1;

    // 找到确认按钮和取消按钮
    const confirmBtn = buttons.find(b => b.style !== 'cancel') || buttons[0];
    const cancelBtn = buttons.find(b => b.style === 'cancel');

    // 通过全局方法触发弹窗
    showAlertGlobal?.({
      title,
      text,
      onlyConfirm,
      onConfirm: confirmBtn?.onPress, // 点击确认调用
      onCancel: cancelBtn?.onPress, // 点击取消调用
    });
  },
};
