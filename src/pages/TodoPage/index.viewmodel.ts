import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Todo {
  id: number;
  title: string;
  isComplete: boolean;
}

let todosData: Todo[] = [
  { id: 1, title: 'Buy milk', isComplete: false },
  { id: 2, title: 'Buy eggs', isComplete: false },
  { id: 3, title: 'Buy bread', isComplete: false },
];

const getTodosApi = () =>
  new Promise<Todo[]>((resolve) => {
    setTimeout(() => {
      resolve(todosData);
    }, 500);
  });

const editTodoApi = (id: number, todo: Todo) => {
  todosData = todosData.map((x) => (x.id === id ? todo : x));
  return new Promise<Todo[]>((resolve) => {
    setTimeout(() => {
      resolve(todosData);
    }, 500);
  });
};

const toggleTodoApi = (id: number) => {
  todosData = todosData.map((x) => (x.id === id ? { ...x, isComplete: !x.isComplete } : x));
  return new Promise<Todo[]>((resolve) => {
    setTimeout(() => {
      resolve(todosData);
    }, 200);
  });
};

interface TodoPageState {
  todos: Todo[] | null | undefined;
  isLoading: boolean;
}

interface TodoPageActions {
  editTodo: (id: number, todo: Todo) => void;
  toggleTodo: (id: number) => void;
}

interface TodoPageViewModel {
  (): { state: TodoPageState; actions: TodoPageActions };
}

const TodoPageViewModel: TodoPageViewModel = () => {
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery(['todos'], getTodosApi);
  const { mutate: editTodo } = useMutation(
    ({ id, todo }: { id: number; todo: Todo }) => editTodoApi(id, todo),
    {
      onSuccess: (data) => queryClient.setQueryData(['todos'], data),
    }
  );
  // 서버에 다시 쿼리 요청하여 업데이트
  // const { mutate: toggleTodo } = useMutation((id: number) => toggleTodoApi(id), {
  //   onSuccess: () => queryClient.invalidateQueries(['todos']),
  // });
  // 서버 응답으로 업데이트
  // const { mutate: toggleTodo } = useMutation((id: number) => toggleTodoApi(id), {
  //   onSuccess: (data) => queryClient.setQueryData(['todos'], data),
  // });
  // 직접 가공하여 업데이트
  // const { mutate: toggleTodo } = useMutation((id: number) => toggleTodoApi(id), {
  //   onSuccess: (_, id) => {
  //     const oldData = queryClient.getQueryData<Todo[]>(['todos']);
  //     queryClient.setQueryData<Todo[]>(
  //       ['todos'],
  //       (oldData || []).map((x) => (x.id === id ? { ...x, isComplete: !x.isComplete } : x))
  //     );
  //   },
  // });
  // 낙관적 업데이트
  const { mutate: toggleTodo } = useMutation((id: number) => toggleTodoApi(id), {
    onMutate: async (id) => {
      //error 발생 시 refetch 메서드가 사용되지 않도록 미리 막아둠.
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const oldData = queryClient.getQueryData<Todo[]>(['todos']);
      queryClient.setQueryData<Todo[]>(
        ['todos'],
        (oldData || []).map((x) => (x.id === id ? { ...x, isComplete: !x.isComplete } : x))
      );

      return { oldData };
    },
    onError: (_, __, context) => {
      if (context === undefined || context.oldData === undefined) return;
      queryClient.setQueryData<Todo[]>(['todos'], [...context.oldData]);
    },
  });

  return {
    state: { todos, isLoading },
    actions: { editTodo: (id: number, todo: Todo) => editTodo({ id, todo }), toggleTodo },
  };
};

export default TodoPageViewModel;
