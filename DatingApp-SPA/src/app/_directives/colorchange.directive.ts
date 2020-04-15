import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appColorchange]'
})
export class ColorchangeDirective {

  constructor(private element:ElementRef) { 
    element.nativeElement.style.backgroundColor='green';
  } 



}
