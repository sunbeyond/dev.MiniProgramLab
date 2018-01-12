module.exports = {
	doChart( canvasId, data, {
			width	= 375,	// canvas 宽
			height	= 300,	// canvas 高
			padding = 20,	// canvas内边距
			asideSpace = 30,	// x、y轴label区域的大小
			// 主轴、标签
			axis = {
				labelSize:		12,	// 字号
				labelColor:		'#cc6966',	// 字色
				labelType:		[],	// label type name，[ 'x label type', 'y label type' ]
				labelMargin:	12,	// 标签外间距px
				width:			1,	// 参考线宽度（px）
				color:			'#cc6966'	// 轴色
			},
			// 标记线
			marker = {
				color:			'#E0E0E0',	// 色
				yCount:			10,	// y轴主标记个数
				xVisibility:	true,	// 显示x轴
				yVisibility:	true,	// 显示y轴
			},
			// 图表数据
			chart = {
				lineColor:	'#cc6966',	// 折线图中，折线的颜色
				dotsColor:	'#cc6966',	// 数据点的颜色
				dotsSize:	4,	// 数据点大小（px)
				fontSize:	20,	// 图表数值范围内的字号
				fontColor:	'#cc6966',
				fontBaseline:	'bottom',	// 文字基线
				fontPadding:	4,	// 字内边距（px）
				offsetX:	20,	// 数据起点偏移值(px)
				padding:	0.1	// 内间距比例（百分比）
			},
			// 渐变色
			linearGradient = {
				startColor:	'rgba( 207,106,99, 0.7 )',	// 起点色
				endColor:	'rgba( 207,106,99, 0.1 )'	// 终点色
			},
			// 动画
			animate = {
				start:	0,	// 起始（百分比）
				finish:	100,	// 完成（百分比）
				inc:	2,	// 增长幅度
				time:	500	// 动画时间（ms）
			},
		} = {} ) {
      	var ctx = wx.createCanvasContext( canvasId ),
            // 绘图区
			chartArea = {
				width:	width -padding * 2 - asideSpace,
				height:	height - padding * 2 - asideSpace
			},
            // 数据点
			dots = {
				count:	data.length,	// 数据个数
				data:	data.map( value => parseInt( value[ 1 ] ) )	// 单独存数据
			},
			xSpace = parseInt( chartArea.width / dots.count ),	// x单位的间隔
			maxVal = parseInt( Math.max.apply( {}, dots.data ) * ( 1 + chart.padding ) ),	// 最大值
			minVal = parseInt( Math.min.apply( {}, dots.data ) - ( maxVal - maxVal / (  1 + chart.padding ) ) ),	// 数据中的最小值
			range = maxVal - minVal,
			// ( 0, 0 )坐标位置
			origin = {
				x:	padding + asideSpace,
				y:	padding + chartArea.height
			},
			freq = animate.time / ( ( animate.finish - animate.start ) / animate.inc )	// 动画频率

		drawAxiaMarker(); // 绘制图表轴、标签和标记
		drawLineAnimate(); // 绘制折线图的动画

        // 线性渐变色
		function drawLinearGradient() {
			let gradient = ctx.createLinearGradient( 0, 0, 0, origin.y )
	        gradient.addColorStop( 0, linearGradient.startColor )
	        gradient.addColorStop( 1, linearGradient.endColor )
			return gradient
		}

        // 数据项处理
		function baseDataForEach( cb ) {
			let rate = animate.start / animate.finish

			dots.data.forEach( ( val, idx ) => {
				let dval = parseInt( chartArea.height * ( 1 - ( maxVal - val ) / range ) * rate ),
					x = origin.x + xSpace * idx + chart.offsetX,
					y = origin.y - dval

				cb( x, y, val, idx )
			} )
		}

        // 动画
		function drawAnimate() {
			let fn = () => {
					ctx.clearRect( 0, 0, width, height )
					drawAxiaMarker()
					drawLineAnimate()
				},
				rt = setTimeout( fn, freq )

			animate.start < animate.finish
				?	animate.start += animate.inc
				:	clearTimeout( rt )
		}

		// 主轴、标签
		function drawAxiaMarker() {
			ctx.setFontSize( axis.labelSize )
			ctx.setLineWidth( axis.width )
			ctx.setFillStyle( axis.labelColor )
			ctx.setStrokeStyle( axis.color )

			drawLine( origin.x - axis.width / 2, origin.y, origin.x + chartArea.width, origin.y )	// x轴
			drawLine( origin.x, origin.y, origin.x, padding )	// y轴

			drawMarker()
		}

		// 画线
		function drawLine( x, y, X, Y ) {
			ctx.beginPath()
			ctx.moveTo( x, y )
			ctx.lineTo( X, Y )
			ctx.stroke()
			ctx.closePath()
		}

        // 标记线
		function drawMarker() {
			let yGap = parseInt( range / marker.yCount )

			ctx.setStrokeStyle( marker.color )

			// y轴
			ctx.setTextAlign( 'right' )
			ctx.setTextBaseline( 'middle' )

			for ( let i = 0; i <= marker.yCount; i++ ) {
				let markerVal = i * yGap,
					xMarker = origin.x - axis.labelMargin,
					yMarker = parseInt( chartArea.height * ( 1 - markerVal / range ) ) + padding

				ctx.fillText( markerVal - Math.abs( minVal ), xMarker, yMarker )	// label
				marker.yVisibility
					&&	i > 0
					&&	drawLine( origin.x + axis.width, yMarker, origin.x + chartArea.width, yMarker )
			}

			// x轴
			ctx.setTextAlign( 'center' )
			ctx.setTextBaseline( 'top' )

			dots.data.forEach( ( val, idx ) => {
				let xMarker = origin.x + idx * xSpace

				ctx.fillText( data[ idx ][ 0 ], xMarker + chart.offsetX, origin.y + axis.labelMargin );	// label
				marker.xVisibility
					&&	( idx > 0 || chart.offsetX > 0 )
					&&	drawLine( xMarker + chart.offsetX, origin.y - axis.width, xMarker + chart.offsetX, padding )
			} )

			ctx.save()

            // 显示类别名称
			if ( axis.labelType.length === 2 ) {
				ctx.fillText( axis.labelType[ 0 ], origin.x + chartArea.width / 2, origin.y + axis.labelMargin * 2 + axis.labelSize )
				ctx.rotate( -Math.PI / 2 )
				ctx.fillText( axis.labelType[ 1 ], -height / 2, padding )
				ctx.restore()
			}
		};

	    // 绘制折线图
	    function drawLineAnimate() {
	    	ctx.setStrokeStyle( chart.lineColor )

	        // 连线
	        ctx.beginPath()
			baseDataForEach( ( x, y, val, idx ) => {
				// 连线
				!idx
					?	ctx.moveTo( x, y )	 // 0
					:	ctx.lineTo( x, y )
			} )
	        ctx.stroke()

	        // 背景
	        ctx.lineTo( origin.x + xSpace * ( dots.count - 1 ) + chart.offsetX, origin.y )
	        ctx.lineTo( origin.x + chart.offsetX, origin.y )

	        // 背景渐变色
	        ctx.setFillStyle( drawLinearGradient() )
	        ctx.fill()
	        ctx.closePath()

	        // 绘制点
			baseDataForEach( ( x, y, val ) => {
				ctx.setFillStyle( chart.dotsColor )
				drawArc( x, y )  // 点
				// 文字
				ctx.setFillStyle( chart.fontColor )
				ctx.setFontSize( chart.fontSize )
				ctx.setTextBaseline( chart.fontBaseline )
				ctx.fillText( parseInt( val * animate.start / animate.finish ), x, y - chart.fontPadding )
			} )

		    drawAnimate()

		    ctx.draw()
		}

		//绘制圆点
		function drawArc( x, y, X, Y ) {
			ctx.beginPath()
			ctx.arc( x, y, chart.dotsSize, 0, Math.PI * 2 )
			ctx.fill()
			ctx.closePath()
		}
	}
}
