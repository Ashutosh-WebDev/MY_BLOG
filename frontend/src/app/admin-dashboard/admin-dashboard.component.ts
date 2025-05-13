import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService, Post } from '../services/post.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.error = '';

    this.postService.getPosts().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load posts';
        this.loading = false;
        console.error('Error loading posts:', err);
      }
    });
  }

  deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post._id !== id);
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to delete post';
          console.error('Error deleting post:', err);
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
