interface IProps {
  backgroundActive?: string;
  backgroundInactive?: string;
  circleColorActive?: string;
  circleColorInactive?: string;
  // circleStyle?: ViewStyle;
  circleStyle?: string;
  disabled?: boolean;
  height?: number;
  // onAsyncPress?: callbackFunc;
  onAsyncPress?: any;
  onSyncPress?: (value: boolean) => void;
  // style?: ViewStyle;
  style?: any;
  value?: boolean;
  width?: number;
}

declare function ToggleSwitch(props: IProps): any;

export = ToggleSwitch;