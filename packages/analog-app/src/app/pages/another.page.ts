import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'analog-app-another',
  standalone: true,
  imports: [RouterLink],
  template: `
  <a routerLink="/protected">Protected</a> `
})
export default class AnotherComponent {
}
