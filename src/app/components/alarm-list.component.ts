import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmService } from '../services/alarm.service';
import { Alarm, WEEKDAY_LABELS, WeekDay } from '../models/alarm.model';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-alarm-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Horários Agendados</h2>
      
      <div *ngIf="alarmService.getAlarms()().length === 0" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div class="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-lg font-medium text-gray-600 mb-1">Nenhum horário agendado ainda</p>
        <p class="text-gray-500">Escolha o dia da semana e informe a hora para agendar</p>
      </div>
      
      <div *ngIf="alarmService.getAlarms()().length > 0" class="space-y-4">
        <div *ngFor="let alarm of alarmService.getAlarms()()" class="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xl font-bold">{{ alarm.time }}</span>
              <span 
                class="px-2 py-1 text-xs rounded-full" 
                [class.bg-green-100]="alarm.isActive" 
                [class.text-green-800]="alarm.isActive"
                [class.bg-gray-100]="!alarm.isActive" 
                [class.text-gray-800]="!alarm.isActive">
                {{ alarm.isActive ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
            
            <div class="text-sm text-gray-600 mt-1">
              <ng-container *ngIf="alarm.specificDate">
                {{ formatDate(alarm.specificDate) }}
              </ng-container>
              
              <ng-container *ngIf="!alarm.specificDate">
                <span *ngFor="let day of alarm.days; let last = last">
                  {{ weekdayLabels[day] }}{{ !last ? ', ' : '' }}
                </span>
              </ng-container>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              class="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
              (click)="toggleAlarm(alarm)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="alarm.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path *ngIf="!alarm.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <button 
              class="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
              (click)="removeAlarm(alarm)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AlarmListComponent {
  alarmService = inject(AlarmService);
  weekdayLabels = WEEKDAY_LABELS;
  
  formatDate(date: Date): string {
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  }
  
  toggleAlarm(alarm: Alarm) {
    this.alarmService.toggleAlarmActive(alarm.id);
  }
  
  removeAlarm(alarm: Alarm) {
    this.alarmService.removeAlarm(alarm.id);
  }
}