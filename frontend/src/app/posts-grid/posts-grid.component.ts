import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService, Post } from '../services/post.service';

@Component({
  selector: 'app-posts-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './posts-grid.component.html',
  styleUrls: ['./posts-grid.component.css']
})
export class PostsGridComponent implements OnInit {
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

    this.postService.getAllPosts().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading posts:', error);
        this.loading = false;
        this.error = error.error?.message || 'Failed to load posts';
        // Fallback data if API fails
        this.posts = [
          {
            _id: '1',
            title: 'Understanding Angular Standalone Components',
            excerpt: 'A quick dive into the new Angular standalone component API...',
            content: 'Sample content...',
            image: '/assets/images/blog-image.jpg',
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }
    });
  }

  getImageUrl(image: string | undefined): string {
    return this.postService.getImageUrl(image);
  }
}