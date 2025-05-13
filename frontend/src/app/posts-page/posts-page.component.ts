import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { PostsCarouselComponent } from '../posts-carousel/posts-carousel.component';
import { PostsGridComponent } from '../posts-grid/posts-grid.component';
import { ContactSectionComponent } from '../contact-section/contact-section.component';

@Component({
  selector: 'app-posts-page',
  standalone: true,
  imports: [
    NavbarComponent,
    PostsCarouselComponent,
    PostsGridComponent,
    ContactSectionComponent
  ],
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})
export class PostsPageComponent {}