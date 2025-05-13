import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from '../services/post.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ContactSectionComponent } from '../contact-section/contact-section.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ContactSectionComponent,
    FontAwesomeModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = true;
  error = '';
  faCalendar = faCalendar;
  faUser = faUser;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.loading = true;
    this.postService.getPostById(id).subscribe({
      next: (post: Post) => {
        this.post = post;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading post:', error);
        this.error = error.error?.message || 'Failed to load post';
        this.loading = false;
      }
    });
  }

  getImageUrl(image: string | undefined): string {
    return this.postService.getImageUrl(image);
  }
}