import React from "react";
import styles from "./Collection.module.css";
import CollectionElement from "./CollectionElement";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "react-feather";

class Collection extends React.Component {
  constructor(props) {
    super(props);
    this.plantPerPage = 5;
  }

  state = { searchInput: "", page: 1 };

  onSearchChange = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  renderList() {
    const page = this.state.page;
    const plantsToDisplay = this.props.plants.slice(
      (page - 1) * this.plantPerPage,
      page * this.plantPerPage
    );

    const filteredPlants = plantsToDisplay.filter((plant) => {
      return plant.name
        .toLowerCase()
        .includes(this.state.searchInput.toLowerCase().trim());
    });

    return (
      <div className={styles.elementContainer}>
        {filteredPlants.map((plant) => (
          <CollectionElement
            key={plant._id}
            name={plant.name}
            url={plant.url}
          />
        ))}
      </div>
    );
  }

  incrementPage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  decrementPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  goToFirstPage = () => {
    this.setState({ page: 1 });
  };

  goToLastPage = () => {
    const plantCount = this.props.plants.length;
    this.setState({ page: Math.ceil(plantCount / this.plantPerPage) });
  };

  AtFirstPage = () => {
    return this.state.page === 1;
  };

  AtLastPage = () => {
    const plantCount = this.props.plants.length;
    return this.state.page === Math.ceil((plantCount || 1) / this.plantPerPage);
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Collection</p>
          <div className={styles.searchbar}>
            <input
              type='search'
              placeholder='search'
              onChange={this.onSearchChange}
            ></input>
          </div>
        </div>
        {this.renderList()}
        <div className={styles.footer}>
          <button
            className={
              this.AtFirstPage()
                ? styles.footerButtonDisabled
                : styles.footerButton
            }
            disabled={this.AtFirstPage()}
            onClick={this.goToFirstPage}
          >
            <ChevronsLeft />
          </button>
          <button
            className={
              this.AtFirstPage()
                ? styles.footerButtonDisabled
                : styles.footerButton
            }
            disabled={this.AtFirstPage()}
            onClick={this.decrementPage}
          >
            <ChevronLeft />
          </button>
          <p>{this.state.page}</p>
          <button
            className={
              this.AtLastPage()
                ? styles.footerButtonDisabled
                : styles.footerButton
            }
            disabled={this.AtLastPage()}
            onClick={this.incrementPage}
          >
            <ChevronRight />
          </button>
          <button
            className={
              this.AtLastPage()
                ? styles.footerButtonDisabled
                : styles.footerButton
            }
            disabled={this.AtLastPage()}
            onClick={this.goToLastPage}
          >
            <ChevronsRight />
          </button>
        </div>
      </div>
    );
  }
}

export default Collection;
