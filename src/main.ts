import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AlarmFormComponent } from './app/components/alarm-form.component';
import { AlarmListComponent } from './app/components/alarm-list.component';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlarmFormComponent, AlarmListComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Agendador de Alarmes</h1>
        <p class="text-gray-600">Configure seus alarmes para dias específicos ou dias da semana</p>
      </header>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-alarm-form></app-alarm-form>
        <app-alarm-list></app-alarm-list>
      </div>
    </div>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, {
  providers: [
    provideAnimations()
  ]
});