import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { WelcomeSectionComponent } from '../welcome-section/welcome-section.component';
import { FeaturedPostsComponent } from '../featured-posts/featured-posts.component';
import { ContactSectionComponent } from '../contact-section/contact-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavbarComponent,
    WelcomeSectionComponent,
    FeaturedPostsComponent,
    ContactSectionComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {}