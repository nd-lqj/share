import React, { Component } from 'react';
import './App.css';

// 1、需求：点击段落中的某个文字，获取到文字，并添加特殊样式标识该选中文字
// 	问题转换：点击一个段落，如何定位选中的是哪个文字？
// 	解决方案：
// 		最初，遍历段落每个文字，转换为span标签，计算span标签的位置与点击事件的pageX，pageY，判断是否为点击的文字
// 		问题：样式加到span的标签后，border，margin样式使得段落和没有加span标签的时候展示不一致了。比如：http://localhost:8080/#/details/9b445c79-d8b3-4a60-ac63-1db1c120496f?id=11  释义第2条中的雨字
// 		优化，添加一个 i 标签做背景，通过层级控制，显示在文字下面。
// 		问题：频繁DOM操作，效率低下。通过使用二分查找，减少查找时间，减少DOM操作。

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clickedWord: '',
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  }
  getWordClicked = (event) => {
    let element = event.target
    // 查找目标字符串
    const innerHTMLOrigin = element.innerHTML
    // 查找结果
    let word = ''
    let clientRect
    let positionTagElement
    // 二分法查找被点击的字符
    let start = 0
    let end = innerHTMLOrigin.length - 1
    for (; start <= end;) {
      const i = parseInt((start + end) / 2, 10)
      word = innerHTMLOrigin.substr(i, 1)
      element.innerHTML = `${innerHTMLOrigin.substr(0, i)}<span id="positionTagElement">${word}</span>${innerHTMLOrigin.substr(i + 1)}`
      positionTagElement = document.getElementById('positionTagElement')
      clientRect = positionTagElement.getBoundingClientRect()
      if ((event.pageX < clientRect.left && event.pageY <= clientRect.bottom) || (event.pageY < clientRect.top)) { // 在前半截
        end = i - 1
      } else if ((event.pageX > clientRect.right && event.pageY >= clientRect.top) || (event.pageY > clientRect.bottom)) { // 在后半截
        start = i + 1
      } else {
        break
      }
      word = ''
    }
    // 恢复原有字符串
    element.innerHTML = innerHTMLOrigin
    if (word) {
      return {word,
        position: {
          top: clientRect.top - element.parentElement.getBoundingClientRect().top,
          left: clientRect.left - element.parentElement.getBoundingClientRect().left,
          width: clientRect.width,
          height: clientRect.height
        }
      }
    }
    return null
  }
  clickHandle = (e) => {
    const wordInfo = this.getWordClicked(e)
    this.setState({
      clickedWord: wordInfo.word,
      ...wordInfo.position
    })
  }
  render() {
    return (
      <div>
        <div className="app">
          <span onClick={this.clickHandle}>《禹本纪》与此同。高诱称河出昆山，伏流地中万三发发发发发付里，禹导而通之；出积石山。案《山海经》：自昆仑至积石千七百四十里。自积石出陇西郡至洛，准《地志》可五千余里。</span>
          {
            this.state.clickedWord ? <i className="word-bg" style={{
              top: this.state.top - 5,
              left: this.state.left - 5,
              width: this.state.width,
              height: this.state.height
            }} /> : null
          }
        </div>
        <div className="word-info">
          word: {this.state.clickedWord}<br />
          top: {this.state.top}<br />
          left: {this.state.left}<br />
          width: {this.state.width}<br />
          height: {this.state.height}
        </div>
      </div>
    );
  }
}

export default App;
