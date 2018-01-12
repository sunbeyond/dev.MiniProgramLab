// view/canvas/canvas.js
const chartLine = require( '../../utils/chartLine.js' )

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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	chartLine.doChart( 'myCanvas', [
		[ '星期一', 50 ],
		[ '星期二', 120 ],
		[ '星期三', -500.32 ],
		[ '星期四', 0 ],
		[ '星期五', -40 ],
		[ '星期六', 2213.43 ],
		[ '星期天', 123 ]
	], {
		width: 375,
		height:	500
	} );
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
