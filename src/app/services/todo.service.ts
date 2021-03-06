import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../model/filtering.model';
import { Todo } from '../model/todo.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {


  private static readonly TodoStorageKey = 'todos';

  private todos: Todo[];
  private filteredTodos: Todo[];

  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private displayTodoSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);

  private currentFilter: Filter = Filter.All;

  todo$: Observable<Todo[]> = this.displayTodoSubject.asObservable();

  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) {

  }

  fetchFromLocalStorage() {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    console.log(this.todos);
    this.filteredTodos = [...this.todos];
    this.updateTodosData();
  }

  private updateTodosData() {
    this.displayTodoSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }

  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();


  }

  addTodo(todoContent: string) {
    const id = new Date(Date.now()).getTime();
    const newTodo = new Todo(id, todoContent);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  filterTodos(filter: Filter, isFiltering: boolean = true) {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter( todo => !todo.isCompleted);
        break;
      case Filter.Completed:
        this.filteredTodos = this.todos.filter( todo => todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos = [...this.todos];
        break;

    }

    if (isFiltering) {
      this.updateTodosData();
    }
  }

  changeTodoStatus(id: number, isCompleted:boolean){
    const index = this.todos.findIndex(item => item.id === id);
    const currentTodo = this.todos[index];
    currentTodo.isCompleted = isCompleted;
    this.todos.splice(index, 1, currentTodo);
    this.updateToLocalStorage();

  }

  editTodo(todo: Todo){
    const index = this.todos.findIndex(item => item.id === todo.id);
    const currentTodo = this.todos[index];
    currentTodo.content = todo.content;
    this.todos.splice(index, 1, currentTodo);
    this.updateToLocalStorage();

  }

  deleteTodo(id: number){
    const index = this.todos.findIndex(item => item.id === id);
    this.todos.splice(index, 1);
    this.updateToLocalStorage();

  }

  toggleAll(){
    this.todos = this.todos.map( todo => {
      return {
        ...todo,
        isCompleted : !this.todos.every(t => t.isCompleted)
      };
    });
    this.updateToLocalStorage();
  }

  clearCompleted(){
    this.todos = this.todos.filter(t => !t.isCompleted);
    this.updateToLocalStorage();
  }

}
