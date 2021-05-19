import { Directive, ElementRef, HostBinding, HostListener, Input } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {

@HostBinding('class.open') defaultDropdownState: boolean = false;

@HostListener('click') toggleOpen() {
    this.defaultDropdownState = !this.defaultDropdownState
}
}