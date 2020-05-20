import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

// Using custom components so can cross platform with react native
import SearchInput from './components/SearchInput';
import SearchContainer from './components/SearchContainer';

// Using hooks to filter and return search jsx based on the first 2 chars
// Conditional rendering applied since catResults begins as an empty array
function AppHooks() {
  const [cats, setCats] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [catResults, setCatResults] = React.useState(cats);

  let loadingState = null;
  let loadingTitle = null;
  // Application content type needed only, no token header type required
  React.useEffect(() => {
    console.log(cats);
    setIsLoading(true);
    fetch('https://api.thecatapi.com/v1/breeds', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error('Error fetching cats!');
        }
      })
      .then((cats) => {
        setCatResults(cats);
        setCats(cats);
        setIsLoading(false);
        console.log(cats);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const project = (dogFriendly) => {
    switch (dogFriendly) {
      case 1:
        return <span>😻</span>;
      case 2:
        return <span>😻😻</span>;
      case 3:
        return <span>😻😻😻</span>;
      case 4:
        return <span>😻😻😻😻 </span>;
      case 5:
        return <span>😻😻😻😻😻 </span>;

      default:
        return <span>😻 </span>;
    }
  };

  // Dark mode code position left
  const [darkMode, setDarkMode] = React.useState(getInitialMode());
  React.useEffect(() => {
    localStorage.setItem('dark', JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist drak mode theme to locla storage
  function getInitialMode() {
    const isReturningUser = 'dark' in localStorage;
    const savedMode = JSON.parse(localStorage.getItem('dark'));
    const userPrefersDark = getPrefColorScheme();

    if (isReturningUser) {
      return savedMode;
    } else if (userPrefersDark) {
      return true;
    } else {
      return false;
    }
  }

  function getPrefColorScheme() {
    if (!window.matchMedia) return;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  // End dark mode code

  // Begin filter logic
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  React.useEffect(() => {
    const results = cats.filter(
      (cat) =>
        cat.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1
    );
    setCatResults(results);
  }, [searchTerm]);
  // End filter logic

  if (error) {
    return <h1 style={{ color: 'red' }}>Cat server is down!</h1>;
  }

  if (isLoading) {
    loadingState = <div id='loader'></div>;
    loadingTitle = <h2>Loading spectacular cats...</h2>;
  } else {
    loadingState = '';
    loadingTitle = <h2>Search for cool cats breed.</h2>;
  }

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <div id='content'>
        <nav>
          <div className='header'>
            <h1>CatGenerator</h1>
            <div className='toggle-container'>
              <span
                style={{
                  marginTop: '10px',
                  color: darkMode ? 'grey' : 'yellow',
                }}
              >
                ☀︎
              </span>
              <span className='toggle'>
                <input
                  checked={darkMode}
                  onChange={() => setDarkMode((prevMode) => !prevMode)}
                  id='checkbox'
                  className='checkbox'
                  type='checkbox'
                />
                <label htmlFor='checkbox' />
              </span>
              <span
                style={{
                  marginTop: '11px',
                  color: darkMode ? 'slateblue' : 'grey',
                }}
              >
                ☾
              </span>
            </div>
          </div>
        </nav>
        <main>
          <div id='mainContent'>
            <div id='contentHeader'> {loadingTitle} </div>
            <div>{loadingState}</div>

            <SearchContainer>
              <SearchInput
                type='text'
                onChange={handleChange}
                placeholder='Search...'
                value={searchTerm}
              ></SearchInput>
            </SearchContainer>

            <div id='catContainer'>
              {catResults.length > 0 ? (
                catResults.map((post, i) => (
                  <div className='cat-column' key={i}>
                    <div className='cat-card'>
                      <div className='tooltip'>
                        <img
                          width='150'
                          height='150'
                          src={require('../public/catpic' +
                            Math.floor(Math.random() * Math.ceil(3)) +
                            '.jpg')}
                          alt='Cat not found.'
                        />
                        <span className='tooltiptext'>Feed me!</span>
                      </div>
                      <h2>Breed Name </h2> {post.name}
                      <h2>Character </h2> {post.temperament}
                      <h2>Description </h2>
                      {post.description}
                      <h2>Social Needs (5/5)</h2>
                      {project(post.social_needs)}
                      <h2>Lifespan </h2> {post.life_span}
                      <h2>Social status </h2> {post.social_needs}
                    </div>
                  </div>
                ))
              ) : searchTerm.length > 1 ? (
                <h2 style={{ color: 'orange' }}>
                  Sorry, could not find any breeds for your search.
                </h2>
              ) : (
                ''
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// We can do this using React classes where we have props & lifecycle methods
// Or use prop rendering approach where we pass the props of api in state to child component for render

const rootElement = document.getElementById('root');
ReactDOM.render(<AppHooks />, rootElement);
