import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../Members/member-edit/member-edit.component';

@Injectable()
export class UnsavedChanges implements CanDeactivate<MemberEditComponent> {
  canDeactivate(component: MemberEditComponent){
    if(component.editForm.dirty){
        return confirm("unsaved changes");
    }
    return true;
  }
}
