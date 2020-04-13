import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/User.service';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(
    private userService: UserService,
    private alterify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });

    this.galleryOptions = [
      {
        height: '500px',
        width: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
    ];
    this.galleryImages=this.getImages();
  }

  getImages(){
    const imageUrl=[];
    for(const photo of this.user.photos){
      imageUrl.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }
    console.log('available photos',imageUrl);
    return imageUrl;
  }

  // loadUser() {
  //   let userID = +this.route.snapshot.params['id'];
  //   console.log('routere params', userID);
  //   this.userService.getUser(userID).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     },
  //     (error) => this.alterify.error(error)
  //   );
  // }
}
