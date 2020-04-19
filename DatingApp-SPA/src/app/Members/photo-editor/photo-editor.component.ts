import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getIsMainPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  response: string;
  baseUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private us: UserService,
    private alertify: AlertifyService
  ) {
    //this.initializeUploader();
    // this.uploader = new FileUploader({
    //   url:this.baseUrl+ "users/" + this.authService.decodedToken.nameid + "/photos",
    //   authToken: 'Bearer '+localStorage.getItem('token'),
    //   disableMultipart: true // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    // });
  }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    //http://localhost:5000/api/users/6/photos
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const res: Photo = JSON.parse(response);

        const photo = {
          id: res.id,
          url: res.url,
          description: res.description,
          isMain: res.isMain,
          dateAdded: res.dateAdded,
        };
        this.photos.push(photo);
        if(photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.us
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        (x) => {
          const isMainPhoto = this.photos.filter((x) => x.isMain)[0];
          isMainPhoto.isMain = false;
          photo.isMain = true;
          //this.getIsMainPhotoChange.emit(photo.url);
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        },
        (error) => this.alertify.error(error)
      );
  }
  delete(id: number) {
    this.alertify.confirm('Are you want to delete this record??', () => {
      this.us.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(
        () => {
          this.photos.splice(
            this.photos.findIndex((p) => p.id === id),
            1
          );
          this.alertify.success('Photo is deleted successfully');
        },
        (error) => {
          this.alertify.error('error while delete photo');
          console.log(error);
        }
      );
    });
  }
}
