import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:5000/api/contacts';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Create a new contact message
  createContact(contact: { name: string; email: string; message: string }): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  // Get all contact messages (admin only)
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }
}
