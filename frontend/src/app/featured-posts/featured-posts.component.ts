import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService, Post } from '../services/post.service';

@Component({
  selector: 'app-featured-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-posts.component.html',
  styleUrls: ['./featured-posts.component.css']
})
export class FeaturedPostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadFeaturedPosts();
  }

  loadFeaturedPosts() {
    this.loading = true;

    this.postService.getFeaturedPosts().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading featured posts:', error);
        this.loading = false;
        this.error = 'Failed to load featured posts';
        // Add fallback posts if API fails
        // this.posts = [
        //   {
        //     _id: '1',
        //     title: 'Sample Blog Post 1',
        //     excerpt: 'This is a sample blog post.',
        //     content: 'Sample content',
        //     image: '/assets/images/blog-image.jpg',
        //     createdAt: new Date().toISOString(),
        //     updatedAt: new Date().toISOString()
        //   },
        //   {
        //     _id: '2',
        //     title: 'Sample Blog Post 2',
        //     excerpt: 'Another sample blog post.',
        //     content: 'More sample content',
        //     image: '/assets/images/blog-image.jpg',
        //     createdAt: new Date().toISOString(),
        //     updatedAt: new Date().toISOString()
        //   }
        // ];
      }
    });
  }
}