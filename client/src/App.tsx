import { useState } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
} from 'react-router-dom';
import StudentsPage from './pages/StudentsPage/StudentsPage';
import HonorCandidatesPage from './pages/HonorCandidatesPage/HonorCandidatesPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { FilterProvider } from './context/FilterContext';
import styles from './App.module.css';

function App() {
    const [activeLink, setActiveLink] = useState(0);

    return (
        <FilterProvider>
            <BrowserRouter>
                {/* Main Navigation */}
                <nav className={styles.nav}>
                    <NavLink
                        to='/students'
                        onClick={() => setActiveLink(0)}
                        className={activeLink === 0 ? styles.active : ''}
                    >
                        Students
                    </NavLink>
                    <NavLink
                        to='/honor-candidates'
                        onClick={() => setActiveLink(1)}
                        className={activeLink === 1 ? styles.active : ''}
                    >
                        Honor Candidates
                    </NavLink>
                </nav>

                {/* Page Routes */}
                <main className={styles.main}>
                    <Routes>
                        <Route path='/' element={<Navigate to='/students' />} />
                        <Route path='/students' element={<StudentsPage />} />
                        <Route
                            path='/honor-candidates'
                            element={<HonorCandidatesPage />}
                        />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </FilterProvider>
    );
}
export default App;
