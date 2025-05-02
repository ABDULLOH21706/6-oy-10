import React, { createContext, useContext, useReducer } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const TodoContext = createContext();

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { text: action.payload, completed: false }];
    case 'DELETE_TODO':
      return state.filter((_, index) => index !== action.payload);
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        index === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    default:
      return state;
  }
};

const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, []);

  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };

  const deleteTodo = (index) => {
    dispatch({ type: 'DELETE_TODO', payload: index });
  };

    const toggleTodo = (index) => {
    dispatch({ type: 'TOGGLE_TODO', payload: index });
  };

  const contextValue = { todos, addTodo, deleteTodo, toggleTodo };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodos = () => {
  return useContext(TodoContext);
};

const TodoList = () => {
  const { todos, addTodo, deleteTodo, toggleTodo} = useTodos();
  const [newTodo, setNewTodo] = React.useState('');

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      addTodo(newTodo);
      setNewTodo('');
    }
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Yangi vazifa"
          variant="outlined"
          value={newTodo}
          onChange={handleInputChange}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddTodo}>
          Qo'shish
        </Button>
      </Box>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} sx={{ display: 'flex', alignItems: 'center' }}>
             <span
              onClick={() => toggleTodo(index)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {todo.text}
            </span>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => deleteTodo(index)}
              sx={{ ml: 'auto' }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </li>
        ))}
      </ul>
    </Box>
  );
};

const App = () => {
  return (
    <TodoProvider>
      <TodoList />
    </TodoProvider>
  );
};


export default App