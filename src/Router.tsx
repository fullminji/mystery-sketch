import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from './store';
import Main from './pages/Main/Main';
import Room from './pages/Room/Room';
import Create from './pages/Room/Create';
import LinkMain from './pages/Main/LinkMain';

const Router = () => {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/main/:roomId" element={<LinkMain />} />
          <Route path="/create" element={<Create />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default Router;
