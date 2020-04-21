export interface NotificationOptions {
  type?: NotificationType;
  areYouSure?: boolean;
  title?: string;
}

export enum NotificationType {
  alert,
  danger,
  success,
  confirm
}
