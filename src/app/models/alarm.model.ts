export interface Alarm {
  id: string;
  time: string; // Format: HH:MM
  days: WeekDay[];
  specificDate?: Date;
  isActive: boolean;
}

export enum WeekDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export const WEEKDAY_LABELS: Record<WeekDay, string> = {
  [WeekDay.SUNDAY]: 'Dom',
  [WeekDay.MONDAY]: 'Seg',
  [WeekDay.TUESDAY]: 'Ter',
  [WeekDay.WEDNESDAY]: 'Qua',
  [WeekDay.THURSDAY]: 'Qui',
  [WeekDay.FRIDAY]: 'Sex',
  [WeekDay.SATURDAY]: 'Sáb'
};