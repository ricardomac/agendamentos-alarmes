import { Injectable, signal } from '@angular/core';
import { Alarm, WeekDay } from '../models/alarm.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  private alarms = signal<Alarm[]>([]);
  private storageKey = 'alarm-scheduler-data';

  constructor() {
    this.loadFromStorage();
  }

  getAlarms() {
    return this.alarms;
  }

  addAlarm(alarm: Omit<Alarm, 'id'>) {
    const newAlarm: Alarm = {
      ...alarm,
      id: this.generateId()
    };
    
    this.alarms.update(alarms => [...alarms, newAlarm]);
    this.saveToStorage();
    return newAlarm;
  }

  removeAlarm(id: string) {
    this.alarms.update(alarms => alarms.filter(alarm => alarm.id !== id));
    this.saveToStorage();
  }

  toggleAlarmActive(id: string) {
    this.alarms.update(alarms => 
      alarms.map(alarm => 
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
    this.saveToStorage();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.alarms()));
  }

  private loadFromStorage() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Convert string dates back to Date objects
        const processedData = parsedData.map((alarm: any) => ({
          ...alarm,
          specificDate: alarm.specificDate ? new Date(alarm.specificDate) : undefined
        }));
        this.alarms.set(processedData);
      }
    } catch (error) {
      console.error('Error loading alarms from storage', error);
    }
  }
}