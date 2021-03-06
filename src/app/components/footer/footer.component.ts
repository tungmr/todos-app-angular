import { Filter, FilterButton } from './../../model/filtering.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  filterButtons: FilterButton[] = [
    {type : Filter.All, label : 'All', isActive: true},
    {type : Filter.Active, label : 'Active', isActive: false},
    {type : Filter.Completed, label : 'Completed', isActive: false}
  ];

  length = 0;

  hasConpleted$: Observable<boolean>;
  detroy$: Subject<null> = new Subject();

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.hasConpleted$ = this.todoService.todo$.pipe(map(todos => todos.some(t => t.isCompleted)),
    takeUntil(this.detroy$)
    );

    this.todoService.length$.pipe(takeUntil(this.detroy$)).subscribe(length => this.length = length);

  }

  filterTodos(type: Filter){
    this.setActivedFilter(type);
    this.todoService.filterTodos(type);
  }

  setActivedFilter(type: Filter){
    this.filterButtons.forEach(filterButton => {
      filterButton.isActive = filterButton.type === type;
    })
  }

  clearCompleted(){
    this.todoService.clearCompleted();
  }

  ngOnDestroy(): void {
    this.detroy$.next();
    this.detroy$.complete();
  }

}
