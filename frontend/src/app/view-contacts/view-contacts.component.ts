import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactService, Contact } from '../services/contact.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-view-contacts',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {
  contacts: Contact[] = [];
  loading = true;
  error = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading = true;
    this.error = '';

    this.contactService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load contacts';
        this.loading = false;
        console.error('Error loading contacts:', err);
      }
    });
  }
}
