// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentId = postId;
    var postData = postsData.postList[postId];
    // this.data.post = postData;
    this.setData({
      post:postData
    });

    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postcollected = postsCollected[postId];
      this.setData({
        collected: postcollected
      });
    }else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    this.setAudioMonitor();
    if (app.globalData.globalPlayingMusic && app.globalData.globalCurrentMusicId===postId){
      this.setData({
        isPlayingMusic: true
      });
    }
  },

  setAudioMonitor:function() {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.globalPlayingMusic = true;
      app.globalData.globalCurrentMusicId = that.data.currentId;
    });

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.globalPlayingMusic = false;
      app.globalData.globalCurrentMusicId = null;
    });
  },

  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postcollected = postsCollected[this.data.currentId];
    postcollected = !postcollected;
    postsCollected[this.data.currentId] = postcollected;
    this.showToast(postsCollected, postcollected);
    // this.showModal(postsCollected, postcollected);
  },

  showToast: function (postsCollected, postcollected) {
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postcollected
    });
    wx.showToast({
      title: postcollected ? '收藏成功' : "取消收藏",
      duration: 1000
    })
  },

  showModal: function (postsCollected, postcollected) {
    var that = this;
    wx.showModal({
      title: '收藏文章',
      content: postcollected?'是否收藏该文章？':'是否取消收藏该文章？',
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确定",
      confirmColor: "#405f80",
      success(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postcollected
          });
        }
      }
    })
  },

  onShareTap : function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        console.log(" 用户" + itemList[res.tapIndex]);
      },
    });
  },
  playMusic: function () {
    var currentId = this.data.currentId;
    var musicData = postsData.postList[currentId].music;
    var isPlayingMusic = this.data.isPlayingMusic;
    // console.log(musicData);
    if(isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      })
    }else {
      wx.playBackgroundAudio({
        dataUrl: musicData.url,
        title: musicData.title,
        coverImgUrl: musicData.coverImg,
        success(res) {
          // console.log("成功", res)
        },
        fail(res) {
          // console.log("失败", res)
        }
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }

})