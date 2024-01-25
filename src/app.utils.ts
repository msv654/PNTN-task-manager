export const showlist = (todos) =>
  `🌻To do list: \n\n${todos
    .map((todo) => (todo.isCompleted ? '✅' : '🟡') + ' ' + todo.name + '\n\n')
    .join('')}`;
