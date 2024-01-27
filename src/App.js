import React  from 'react';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from './components/Container';
import questionData from "./utils/db.json"
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Test from './components/Test';
function App() {

  return (
    <DndProvider backend={HTML5Backend}>
    <Router>
      <Routes>
        <Route path='/' element={<Container questionData={questionData}/>} />
      </Routes>
    </Router>
    </DndProvider>
  );
}

export default App;
