import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  constructor() {}
  list1open = false;
  list2open = false;
  list3open = false;

  ngOnInit() {}
  onSelect1(): boolean {
    return (this.list1open = !this.list1open);
  }
  onSelect2(): boolean {
    return (this.list2open = !this.list2open);
  }
  onSelect3(): boolean {
    return (this.list3open = !this.list3open);
  }
}
