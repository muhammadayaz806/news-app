import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export class News extends Component {
  static defaultProps = {
    country: "us",
    pageSize: 6,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
      hasMore: true,
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews(page = this.state.page) {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${API_KEY}&page=${page}&pagesize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    const lastPage = Math.ceil(parsedData.totalResults / this.props.pageSize);
    const hasMore = page < lastPage;
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
      hasMore,
    });
  }

  async componentDidMount() {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${API_KEY}&page=1&pagesize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // console.log(parsedData);
    // this.setState({
    //   articles: parsedData.articles,
    //   totalResults: parsedData.totalResults,
    //   loading: false,
    // });
    this.updateNews();
  }

  // handlePrevClick = async () => {
  //   const newPage = this.state.page - 1;
  //   this.setState({ page: newPage });
  //   this.updateNews(newPage);
  // };

  // handleNextClick = async () => {
  //   const newPage = this.state.page + 1;
  //   this.setState({ page: newPage });
  //   this.updateNews(newPage);
  // };

  fetchMoreData = async () => {
    if (!this.state.hasMore) {
      return;
    }
    const nextPage = this.state.page + 1;
    this.setState({ page: nextPage, loading: true });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${API_KEY}&page=${nextPage}&pagesize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);

    if (!parsedData.articles || parsedData.articles.length === 0) {
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }

    const lastPage = Math.ceil(parsedData.totalResults / this.props.pageSize);
    const hasMore = nextPage < lastPage;

    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading: false,
      hasMore,
    });
  };

  render() {
    return (
      <>
        <h2 className="text-center my-3">
          Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h2>
        {/* {this.state.loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title}
                      description={element.description}
                      imgUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
            disabled={this.state.page <= 1}
          >
            &larr; Previous
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
          >
            Next &rarr;
          </button>
        </div> */}
      </>
    );
  }
}

export default News;
