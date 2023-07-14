import TodoPageViewModel from './index.viewmodel.ts';

function TodoPage() {
  const {
    state: { todos, isLoading },
    actions: { toggleTodo },
  } = TodoPageViewModel();

  return (
    <div>
      {isLoading ? <p>Loading...</p> : null}
      {todos &&
        todos.map((todo) => (
          <div key={todo.id} className="flex cursor-pointer" onClick={() => toggleTodo(todo.id)}>
            <input type="checkbox" checked={todo.isComplete} readOnly />
            <p>{todo.title}</p>
          </div>
        ))}
    </div>
  );
}

export default TodoPage;
