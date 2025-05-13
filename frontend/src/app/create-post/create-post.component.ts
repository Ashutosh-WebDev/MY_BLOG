import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Post {
  title: string;
  content: string;
  excerpt: string;
  featured?: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  post: Post = {
    title: '',
    content: '',
    excerpt: '',
    featured: false
  };
  loading = false;
  error = '';
  success = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  private apiUrl = 'https://my-blog-pragyan.onrender.com/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.post.title || !this.post.content) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    // Generate excerpt if not provided
    if (!this.post.excerpt) {
      this.previewExcerpt();
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('excerpt', this.post.excerpt);
    formData.append('featured', String(this.post.featured));
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Get headers without content-type (browser will set it for FormData)
    const headers = new HttpHeaders().set(
      'Authorization', 
      `Bearer ${localStorage.getItem('token')}`
    );

    this.http.post<Post>(`${this.apiUrl}/posts`, formData, { headers }).subscribe({
      next: () => {
        this.success = 'Post created successfully';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Failed to create post';
        this.loading = false;
        console.error('Error creating post:', err);
      }
    });
  }

  previewExcerpt() {
    if (this.post.content) {
      // Generate excerpt from content (first 150 characters)
      this.post.excerpt = this.post.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .slice(0, 150) + '...';
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  cancel() {
    this.router.navigate(['/admin/dashboard']);
  }
}