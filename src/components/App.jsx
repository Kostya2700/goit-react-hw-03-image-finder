import React, { Component } from 'react';
import Modal from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';
import { GalleryList } from './ImageGallery/ImageGallery';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { apiSearch } from './Fetch-api/fetch-api';
import { Loader } from './Loader/Loader';

export class App extends Component {
  state = {
    showModal: false,
    search: '',
    arSearch: [],
    visible: false,
    page: 1,
    currentSrc: null,
    alt: null,
    error: null,
    lengthArr: null,
  };
  onClickImage = (largeImg, alt) => {
    this.toggleModal();
    this.setState({ currentSrc: largeImg, alt });
  };
  incrementPage = () => {
    this.setState(state => ({
      page: state.page + 1,
    }));
  };
  toggleModal = e => {
    // console.log(e.target.src);
    this.setState(state => ({
      showModal: !state.showModal,
    }));
  };
  async componentDidUpdate(pP, pS) {
    const { search, page } = this.state;
    // console.log(pS);
    if (pS.search !== search || pS.page !== page) {
      // console.log('Wait');
      try {
        this.setState({ visible: true });
        const response = await apiSearch(search, page);
        if (response.length === 0) {
          toast.info('Images not found');
          return;
        }

        return this.setState(pS => {
          return {
            arSearch: [...this.state.arSearch, ...response],
            lengthArr: response.length,
          };
        });
      } catch (error) {
        this.setState({ error });
      } finally {
        this.setState({ visible: false });
      }
    }
  }

  handleSearchForm = search => {
    this.setState({ search, page: 1, arSearch: [] });
  };
  render() {
    const { arSearch, visible, showModal, currentSrc, alt, lengthArr } =
      this.state;
    return (
      <div className="App">
        <ToastContainer autoClose={3000} />
        <Searchbar inputSearch={this.handleSearchForm} />
        {showModal && (
          <Modal onClose={this.toggleModal} imgSrc={currentSrc} alt={alt} />
        )}
        <GalleryList
          searchName={arSearch}
          onClick={this.onClickImage}
        ></GalleryList>
        {visible && <Loader bool={visible} />}
        {arSearch.length > 0 && lengthArr >= 12 && !visible && (
          <button className="Button" type="button" onClick={this.incrementPage}>
            Load more
          </button>
        )}
      </div>
    );
  }
}
