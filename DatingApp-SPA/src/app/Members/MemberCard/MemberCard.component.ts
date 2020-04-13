import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-MemberCard',
  templateUrl: './MemberCard.component.html',
  styleUrls: ['./MemberCard.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
