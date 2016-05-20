import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Prompt {

  constructor(controller) {
    this.controller = controller;
  }

  activate(input) {
    this.question = input.question;
    this.title = input.title;
  }

}
