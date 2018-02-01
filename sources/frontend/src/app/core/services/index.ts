import { ToDoService } from './todo.service';
import { AuthenticationService } from './authentication.service';

export * from './todo.service';
export * from './authentication.service';

export const CoreServices = [
  ToDoService,
  AuthenticationService
];
