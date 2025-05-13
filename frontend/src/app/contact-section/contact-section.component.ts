import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.css']
})
export class ContactSectionComponent {
  name = '';
  email = '';
  message = '';
  submitted = false;
  error = '';
  loading = false;

  constructor(private contactService: ContactService) {}

  onSubmit() {
    if (!this.name || !this.email || !this.message) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.contactService.createContact({
      name: this.name,
      email: this.email,
      message: this.message
    }).subscribe({
      next: () => {
        this.submitted = true;
        this.loading = false;
        // Reset form after successful submission
        setTimeout(() => {
          this.name = '';
          this.email = '';
          this.message = '';
          this.submitted = false;
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send message';
        this.loading = false;
        console.error('Error sending message:', err);
      }
    });
  }
}