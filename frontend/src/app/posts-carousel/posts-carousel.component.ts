import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService, Post } from '../services/post.service';

@Component({
  selector: 'app-posts-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './posts-carousel.component.html',
  styleUrls: ['./posts-carousel.component.css']
})
export class PostsCarouselComponent implements OnInit, OnDestroy {
  featuredPosts: Post[] = [];
  currentIndex = 0;
  private intervalId: any;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadFeaturedPosts();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  loadFeaturedPosts() {
    this.postService.getFeaturedPosts().subscribe({
      next: (posts) => {
        this.featuredPosts = posts;
        if (this.featuredPosts.length > 0) {
          this.startCarousel(); // Start carousel only when we have posts
        }
      },
      error: (error) => {
        console.error('Error loading featured posts:', error);
      }
    });
  }

  prevSlide() {
    this.stopCarousel(); // Stop auto-roll when user interacts
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.featuredPosts.length - 1;
    this.startCarousel(); // Restart auto-roll
  }

  nextSlide() {
    this.stopCarousel(); // Stop auto-roll when user interacts
    this.currentIndex = (this.currentIndex + 1) % this.featuredPosts.length;
    this.startCarousel(); // Restart auto-roll
  }

  private startCarousel() {
    this.stopCarousel(); // Clear any existing interval
    if (this.featuredPosts.length > 1) { // Only start if we have more than one post
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.featuredPosts.length;
      }, 5000); // Change slide every 5 seconds
    }
  }

  private stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Method for dot navigation
  goToSlide(index: number) {
    this.stopCarousel();
    this.currentIndex = index;
    this.startCarousel();
  }
}