import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Post {
  _id?: string;
  title: string;
  content: string;
  excerpt: string;
  featured: boolean;
  imageUrl?: string;
  author?: {
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  post: Post = {
    title: '',
    content: '',
    excerpt: '',
    featured: false
  };
  loading = false;
  error = '';
  success = '';
  isNewPost = true;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNewPost = false;
      this.loadPost(id);
    }
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  loadPost(id: string) {
    this.loading = true;
    this.http.get<Post>(`${this.apiUrl}/posts/${id}`, this.getHeaders()).subscribe({
      next: (post) => {
        this.post = post;
        if (post.imageUrl) {
          this.imagePreview = `${this.apiUrl}/uploads/${post.imageUrl}`;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load post';
        this.loading = false;
        console.error('Error loading post:', err);
      }
    });
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

    if (!this.post._id) {
      // Create new post
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
    } else {
      // Update existing post
      this.http.put<Post>(`${this.apiUrl}/posts/${this.post._id}`, formData, { headers }).subscribe({
        next: () => {
          this.success = 'Post updated successfully';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Failed to update post';
          this.loading = false;
          console.error('Error saving post:', err);
        }
      });
    }
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
    if (this.post.imageUrl) {
      delete this.post.imageUrl;
    }
  }

  cancelEdit() {
    this.router.navigate(['/admin/dashboard']);
  }
}
