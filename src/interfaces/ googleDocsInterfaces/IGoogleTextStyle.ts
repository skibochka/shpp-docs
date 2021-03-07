import { GoogleLink } from './IGoogleLink';
export interface GoogleTextStyle {
  underline?: boolean;
  bold?: boolean;
  italic?: boolean;
  foregroundColor?: object;
  fontSize: object;
  link?: GoogleLink;
}
