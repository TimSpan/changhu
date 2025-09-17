import type {HostComponent} from 'react-native';
import type {ViewProps} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface MyVideoViewProps extends ViewProps {
  videoUri?: string;
  autoPlay?: boolean;
}

export default codegenNativeComponent<MyVideoViewProps>('MyVideoView') as HostComponent<MyVideoViewProps>;
