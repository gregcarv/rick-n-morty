import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./styles.scss";

/**
 * Functional component:
 * Html wrapper for the label and value for each character and origin attribute
 * e.g.; gender, species, status, origin, dimension, residents
 *
 * @param {string} label
 * @param {string || number} value
 */
const Field = ({ label, value }) => {
  return (
    <div>
      <span className={"label " + label}>{label}</span> <span>{value}</span>
    </div>
  );
};

/**
 * Functional component:
 * outputs the next and previous buttons with an onclick handler
 *
 * @param {string} action
 * @param {function} fetcher // see the approot component for the fetcher function
 * @param {string} url // expecting a url string
 */
const ButtonPreviousNext = ({ action, fetcher, url }) => {
  function handlePaginationClick(e) {
    if (fetcher) {
      fetcher(url);
    } else {
      return false;
    }
  }

  return (
    <button onClick={handlePaginationClick} className={"button-" + action}>
      {action + " page"}
    </button>
  );
};

/**
 * Functional component:
 * outputs which page number the user is currently on of total pages
 *
 * @param {string} next // url string. This gets broken down to only the next page number
 * @param {number} total // total number of pages
 */
const PageIdicator = ({ next, total }) => {
  // set the variable to the url of the next page
  let nextPage = next;

  // if the {next} value exists then proceed
  if (next) {
    // construct a new url from the url string and mutate the variable
    nextPage = new URL(next);
    // get the page search parameter from the url object and mutate the variable
    nextPage = nextPage.searchParams.get("page");
  }

  // let the current page equal the next page number minus 1
  let thisPage = nextPage - 1;

  /* if there is no next page,
   * then the assumption is that we are on the last page
   * The current page should then equal the total number of pages
   */

  if (nextPage === "") {
    thisPage = total;
  }

  // return the html
  return (
    <div className="page-indicator">
      Page {thisPage} of {total}
    </div>
  );
};

/**
 * Functional component:
 * -- Outputs the pagination component with next and previous buttons and the page indicator
 *
 * @param {object} data // expexting data object with next and previous urls and total number of pages
 * @param {function} fetcher // function in AppRoot component. Updates the root component state
 */
const Pagination = ({ data, fetcher }) => {
  // check if data exists
  if (data !== null) {
    // set booleans to determine if we are on the first or last pages
    const firstPage = data.info.prev === "" ? true : false;
    const lastPage = data.info.next === "" ? true : false;

    // set the next and previous urls to new variables
    const nextPage = data.info.next;
    const prevPage = data.info.prev;

    if (firstPage) {
      // if we are on the first page
      // output a next button and the page indicator
      return (
        <div className="pagination">
          <div className="buttons-wrap">
            <ButtonPreviousNext
              action="next"
              fetcher={fetcher}
              url={nextPage}
            />
          </div>
          <PageIdicator next={nextPage} total={data.info.pages} />
        </div>
      );
    } else if (lastPage) {
      // if we are on the last page
      // output a previous button and the page indicator
      return (
        <div className="pagination">
          <div className="buttons-wrap">
            <ButtonPreviousNext
              action="previous"
              fetcher={fetcher}
              url={prevPage}
            />
          </div>
          <PageIdicator next={nextPage} total={data.info.pages} />
        </div>
      );
    } else {
      // otherwise
      // output the previous and next buttons and the page indicator
      return (
        <div className="pagination">
          <div className="buttons-wrap">
            <ButtonPreviousNext
              action="previous"
              fetcher={fetcher}
              url={prevPage}
            />
            <ButtonPreviousNext
              action="next"
              fetcher={fetcher}
              url={nextPage}
            />
          </div>
          <PageIdicator next={nextPage} total={data.info.pages} />
        </div>
      );
    }
  } else {
    // if we have no data output a msg
    return <div className="msg">waiting on data</div>;
  }
};

/**
 * Functional component:
 * -- outputs individual character origin data
 *
 * @param {object} data // expects individual origin data
 */
const OriginInfo = ({ data }) => {
  // check if data exists
  if (data !== null) {
    // return the html
    return (
      <div className="origin-wrap">
        <Field label="origin" value={data.name} />
        <Field label="dimension" value={data.dimension} />
        <Field label="residents" value={data.residents.length} />
      </div>
    );
  }
  // return a msg if no data exists
  return (
    <div className="origin-wrap">
      <div className="msg">
        Origin information not available for this character.
      </div>
    </div>
  );
};

/**
 * Class component:
 * -- Handles the fetch for the origin information per character
 * -- Expecting a url string in the props object
 */
class OriginInfoFetcher extends Component {
  constructor(props) {
    super(props);

    this.showOrigin = this.showOrigin.bind(this);
    this.hideOrigin = this.hideOrigin.bind(this);

    this.state = {
      url: this.props.url,
      data: null,
      showOrigin: false
    };
  }

  // if the component is mounted, handle the data fetch and update the state
  componentDidMount() {
    if (this.state.url !== "") {
      fetch(this.state.url)
        .then(response => response.json())
        .then(
          result => {
            this.setState({
              data: result
            });
          },
          error => {
            this.setState({
              error
            });
          }
        );
    }
  }

  showOrigin() {
    this.setState({
      showOrigin: true
    });
  }

  hideOrigin() {
    this.setState({
      showOrigin: false
    });
  }

  // output the component
  render() {
    const { data } = this.state;
    return (
      <div className="origin-outerwrap">
        {this.state.showOrigin === false ? (
          <span className="toggle open" onClick={this.showOrigin}>
            Show Origin Information
          </span>
        ) : (
          <span className="toggle close" onClick={this.hideOrigin}>
            Close Origin Information
          </span>
        )}
        {this.state.showOrigin === true ? <OriginInfo data={data} /> : false}
      </div>
    );
  }
}

/**
 * Functional component:
 * -- outputs a list of episode names the character appears in
 *
 * @param {object} data // expects individual origin data
 */
const EpisodeInfo = ({ data }) => {
  // check if data exists
  if (data !== null) {
    // return the html
    return (
      <div className="episodes-wrap">
        <h3>Episodes list</h3>
        <ul>
          {data.map((name, index) => (
            // loop through the data and return the episode names
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }
  // return a msg if no data exists
  return (
    <div className="episodes-wrap">
      <div className="msg">
        Episode information not available for this character.
      </div>
    </div>
  );
};

/**
 * Class component:
 * -- Handles the fetch for the episode information per character
 * -- Expecting an array in the props object
 */
class EpisodesFetcher extends Component {
  constructor(props) {
    super(props);

    this.showEpisodes = this.showEpisodes.bind(this);
    this.hideEpisodes = this.hideEpisodes.bind(this);

    this.state = {
      episodesArray: this.props.episodes,
      data: [],
      showEpisodes: false
    };
  }

  // if the component is mounted, handle the data fetch and update the state
  componentDidMount() {
    if (this.state.episodesArray.length > 0) {
      this.state.episodesArray.forEach(episode => {
        fetch(episode)
          .then(response => response.json())
          .then(
            result => {
              this.state.data.push(result.name);
            },
            error => {
              this.setState({
                error
              });
            }
          );
      });
    }
  }

  showEpisodes() {
    this.setState({
      showEpisodes: true
    });
  }

  hideEpisodes() {
    this.setState({
      showEpisodes: false
    });
  }

  // output the component
  render() {
    const { data } = this.state;
    return (
      <div className="episodes-outerwrap">
        {this.state.showEpisodes === false ? (
          <span className="toggle open" onClick={this.showEpisodes}>
            Show Episodes list
          </span>
        ) : (
          <span className="toggle close" onClick={this.hideEpisodes}>
            Close Episodes list
          </span>
        )}
        {this.state.showEpisodes === true ? <EpisodeInfo data={data} /> : false}
      </div>
    );
  }
}

/**
 * Functional component:
 * -- outputs the character image
 *
 * @param {string} src // expects image src url
 * @param {string} alt // expects character name
 */
const CardImage = ({ src, alt }) => {
  // displays the character image
  return (
    <div className="image-wrap">
      <img src={src} alt={alt} />
    </div>
  );
};

/**
 * Functional component:
 * -- outputs individual character cards
 *
 * @param {object} character // expects individual character data
 */
const Card = ({ character }) => {
  return (
    /* Note: the character status is applied as a data attribute to be used in the css */
    <div
      className="card character"
      data-status={character.status.toLowerCase()}
    >
      <CardImage src={character.image} alt={character.name} />
      <div className="detail-wrap">
        <div className="character-detail">
          <h2>{character.name}</h2>
          {/* displays the character gender */}
          <Field label="gender" value={character.gender} />
          {/* displays the character species */}
          <Field label="species" value={character.species} />
          {/* displays the character status */}
          <Field label="status" value={character.status} />
        </div>
        {/* displays the character origin information */}
        <OriginInfoFetcher url={character.origin.url} />
        <EpisodesFetcher episodes={character.episode} />
      </div>
    </div>
  );
};

/**
 * Functional component:
 * -- Loops through Outputs the cards
 *
 * @param {object} data // expects character data including number of pages
 */
const CardsList = ({ data }) => {
  // if we have data
  if (data !== null) {
    // set the array of character data to a new variable
    const characters = data.results;

    // return the cardlist
    return (
      <section className="cards-list character-list">
        {characters.map((character, index) => (
          // loop through the data and return the character cards
          // see Card component
          <Card key={index} character={character} />
        ))}
      </section>
    );
  }

  return false;
};

/**
 * Class component:
 * -- Root component: This is the application root component
 * -- Includes the data request from the api, and stores it in the state
 *
 */
class AppRoot extends Component {
  constructor(props) {
    super(props);

    // binds the fetcher function to the component so we can use it later
    this.fetcher = this.fetcher.bind(this);

    this.state = {
      baseUrl: "https://rickandmortyapi.com/api/character/",
      data: null
    };
  }

  /**
   * Fetcher function
   * Fetches the character pages and updates the component state
   *
   * @param {string} url // expects a url string
   */
  fetcher(url) {
    // if a url has been passed to the function
    if (url) {
      // fetch the data from the api and update the state
      fetch(url)
        .then(response => response.json())
        .then(
          result => {
            this.setState({
              data: result
            });
          },
          error => {
            this.setState({
              error
            });
          }
        );
    }
  }

  // once the component is mounteed run the fetcher
  componentDidMount() {
    this.fetcher(this.state.baseUrl);
  }

  // render the root component
  render() {
    const { data } = this.state;
    return (
      <div className="wrapper page">
        <header>
          <h1>Rick & Morty Characters</h1>
          <Pagination data={data} fetcher={this.fetcher} />
        </header>
        <main>
          <CardsList data={data} />
        </main>
        <footer>
          <Pagination data={data} fetcher={this.fetcher} />
        </footer>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<AppRoot />, rootElement);
