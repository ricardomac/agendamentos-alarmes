import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alarm, WEEKDAY_LABELS, WeekDay } from '../models/alarm.model';
import { AlarmService } from '../services/alarm.service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-alarm-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Novo Agendamento</h2>
      
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">Tipo de Agendamento</h3>
          <div class="flex space-x-2">
            <button 
              class="btn" 
              [class.btn-primary]="!isSpecificDate()" 
              [class.btn-outline]="isSpecificDate()"
              (click)="setScheduleType(false)">
              Dias da Semana
            </button>
            <button 
              class="btn" 
              [class.btn-primary]="isSpecificDate()" 
              [class.btn-outline]="!isSpecificDate()"
              (click)="setScheduleType(true)">
              Data Específica
            </button>
          </div>
        </div>
        
        <div *ngIf="!isSpecificDate()" class="mb-4">
          <h3 class="text-md font-medium mb-2">Dia da semana</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              *ngFor="let day of weekDays" 
              class="day-button" 
              [class.active]="selectedDays().includes(day)" 
              [class.inactive]="!selectedDays().includes(day)"
              (click)="toggleDay(day)">
              {{ weekdayLabels[day] }}
            </button>
          </div>
        </div>
        
        <div *ngIf="isSpecificDate()" class="mb-4">
          <h3 class="text-md font-medium mb-2">Data específica</h3>
          <input 
            type="date" 
            class="w-full p-2 border border-gray-300 rounded-md"
            [value]="specificDate() ? formatDate(specificDate()!, 'yyyy-MM-dd') : ''"
            (change)="onDateChange($event)"
          />
          <p *ngIf="specificDate()" class="mt-2 text-sm text-gray-600">
            {{ formatDateLong(specificDate()!) }}
          </p>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-md font-medium mb-2">Horário</h3>
        <div class="flex items-center space-x-2">
          <input 
            type="text" 
            class="time-input" 
            placeholder="00" 
            maxlength="2"
            [ngModel]="hours()"
            (ngModelChange)="setHours($event)"
          />
          <span class="text-2xl">:</span>
          <input 
            type="text" 
            class="time-input" 
            placeholder="00" 
            maxlength="2"
            [ngModel]="minutes()"
            (ngModelChange)="setMinutes($event)"
          />
        </div>
      </div>
      
      <button 
        class="btn btn-primary w-full"
        [disabled]="!isFormValid()"
        (click)="saveAlarm()">
        Agendar
      </button>
    </div>
  `
})
export class AlarmFormComponent {
  private alarmService = inject(AlarmService);
  
  weekDays = Object.values(WeekDay).filter(v => !isNaN(Number(v))) as WeekDay[];
  weekdayLabels = WEEKDAY_LABELS;
  
  selectedDays = signal<WeekDay[]>([]);
  specificDateMode = signal<boolean>(false);
  specificDate = signal<Date | null>(null);
  hours = signal<string>('00');
  minutes = signal<string>('00');
  
  isSpecificDate() {
    return this.specificDateMode();
  }
  
  formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr);
  }
  
  formatDateLong(date: Date): string {
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  }
  
  setScheduleType(isSpecific: boolean) {
    this.specificDateMode.set(isSpecific);
    if (isSpecific) {
      this.selectedDays.set([]);
      if (!this.specificDate()) {
        this.specificDate.set(new Date());
      }
    } else {
      this.specificDate.set(null);
    }
  }
  
  toggleDay(day: WeekDay) {
    const currentDays = this.selectedDays();
    if (currentDays.includes(day)) {
      this.selectedDays.set(currentDays.filter(d => d !== day));
    } else {
      this.selectedDays.set([...currentDays, day]);
    }
  }
  
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.specificDate.set(new Date(input.value));
    } else {
      this.specificDate.set(null);
    }
  }
  
  setHours(value: string) {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 23) {
      this.hours.set(numValue.toString().padStart(2, '0'));
    }
  }
  
  setMinutes(value: string) {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
      this.minutes.set(numValue.toString().padStart(2, '0'));
    }
  }
  
  isFormValid() {
    const hasValidTime = this.hours() !== '' && this.minutes() !== '';
    const hasValidSchedule = this.isSpecificDate() 
      ? !!this.specificDate() 
      : this.selectedDays().length > 0;
    
    return hasValidTime && hasValidSchedule;
  }
  
  saveAlarm() {
    if (!this.isFormValid()) return;
    
    const time = `${this.hours()}:${this.minutes()}`;
    
    this.alarmService.addAlarm({
      time,
      days: this.selectedDays(),
      specificDate: this.specificDate() || undefined,
      isActive: true
    });
    
    // Reset form
    this.resetForm();
  }
  
  resetForm() {
    this.selectedDays.set([]);
    this.specificDateMode.set(false);
    this.specificDate.set(null);
    this.hours.set('00');
    this.minutes.set('00');
  }
}