import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  constructor() {}
  liste1offen = false;
  liste2offen = false;
  liste3offen = false;

  ngOnInit() {}
  onSelect1(): boolean {
    return (this.liste1offen = !this.liste1offen);
  }
  onSelect2(): boolean {
    return (this.liste2offen = !this.liste2offen);
  }
  onSelect3(): boolean {
    return (this.liste3offen = !this.liste3offen);
  }
}
