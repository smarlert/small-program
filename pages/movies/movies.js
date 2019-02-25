// pages/movies/movies.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movie:{},
    searchUrl:{},
    containerShow:true,
    searchpannel:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var saleTicketsMovies = app.globalData.globalMoviesUrl + '/PageSubArea/HotPlayMovies.api?locationId=489';
    var inTheaterUrl = app.globalData.globalMoviesUrl + '/Showtime/LocationMovies.api?locationId=489';
    // var comingSoon = app.globalData.globalMoviesUrl + '/Movie/MovieComingNew.api?locationId=290';
    // this.getsaleTicketsMovieListData(saleTicketsMovies);
    this.getinTheaterUrlMovieListData(inTheaterUrl);
    // this.getcomingSoonMovieListData(comingSoon);
  },
  // getsaleTicketsMovieListData: function (url) {
  //   var that = this;
  //   wx.request({
  //     url: url,
  //     data: {
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       that.moviesName(res.data.movies, res.data.movies.titleCn);
  //       console.log(res.data.movies);
  //     }
  //   })
  //   console.log(this.data.movie);
  // },
  getinTheaterUrlMovieListData: function (url) {
    var that = this;
    wx.request({
      url: url,
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.movieData(res.data.ms);
        console.log(that.data.movie);
      }
    })
  },
  // getcomingSoonMovieListData: function (url) {
  //   var that = this;
  //   wx.request({
  //     url: url,
  //     data: {
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       console.log(res.data.attention);
  //     }
  //   })
  // },

  // 提取数据
  movieData: function (data) {
    var movies = [];
    for(var idx in data){
      var movie = data[idx];
      var title = movie.tCn;
      if (title.length >= 7) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: movie.r,
        coverageUrl: movie.img,
        movieId: movie.id
      }
      movies.push(temp);
    }
    this.setData({
      movie:movies
    })
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow:false,
      searchpannel:true
    })
  },

  onCancel: function () {
    this.setData({
      containerShow: true,
      searchpannel: false
    })
  },

  onBindConfirm: function (event) {
    var inputValue = event.detail.value;
    var searchUrl = 'app.globalData.doubanBase' + '/v2/movie/search?q=' + inputValue;
    this.getMovieListData(searchUrl,"searchResult",'');
    console.log(13131);
    console.log(searchUrl);
  },

  // 豆瓣方法

  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        // fail
        console.log(error)
      }
    })
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  }




})