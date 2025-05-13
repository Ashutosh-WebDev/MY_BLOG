import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Author {
  _id: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  imageUrl?: string;
  featured?: boolean;
  author?: Author;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5000/api/posts';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPosts(): Observable<Post[]> {
    return this.getAllPosts();
  }

  getFeaturedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/featured`);
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData);
  }

  updatePost(id: string, postData: FormData): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(image: string | undefined): string {
    return image ? `http://localhost:5000/api/posts/image/${image}` : '/assets/images/blog-image.jpg';
  }
}