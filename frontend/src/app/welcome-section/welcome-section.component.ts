import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome-section.component.html',
  styleUrls: ['./welcome-section.component.css']
})
export class WelcomeSectionComponent {}