import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/model/todo.model';


const fadeStrikeThroughAnimation = trigger('fadeStrikeThrough', [
  state('active', style({ fontSize: '18px', color: 'black' })),
  state('completed', style({ fontSize: '17px', color: 'lightgrey', textDecoration: 'linethrough' })),
  transition('active <=> completed', [animate(250)])
]);

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  animations: [
    fadeStrikeThroughAnimation
  ]
})
export class TodoItemComponent implements OnInit {


  @Input() todo: Todo;

  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() editTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteTodo: EventEmitter<number> = new EventEmitter<number>();
  isHovered = false;
  isEditing = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeTodoStatus() {
    this.changeStatus.emit({ ...this.todo, isCompleted: !this.todo.isCompleted });
  }

  submitEdit(event: KeyboardEvent) {
    const { keyCode } = event;
    event.preventDefault();
    if (keyCode === 13) {
      this.editTodo.emit(this.todo);
      this.isEditing = false;
    }

  }

  onDeleteTodo() {
    this.deleteTodo.emit(this.todo.id);
  }

}
