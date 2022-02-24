//const { parse } = require("dotenv");

const container = document.querySelector(".container");
const formBox = document.querySelector(".box");
const wordArea = document.querySelector("#word");
const smallContainer = document.querySelector("#smallContainer");

// const textAreaArray = document.querySelectorAll('textarea');
// console.log(textAreaArray);

let words = [];

// 시작 좌표
let startPoint = {
  x: smallContainer.offsetWidth / 2,
  y: smallContainer.offsetHeight / 2,
};
console.log(startPoint);

let wordsDown = [];

const options = words.map((word) => {
  return {
    word: word,
    freq: Math.floor(Math.random() * 50),
    rotate: (~~(Math.random() * 6) - 3) * 30,
  };
});

// freq 가 큰 것 부터 정렬
options.sort((a, b) => -1 * (a.freq - b.freq));

console.log(options);
//console.log(options[0].word);

// form 삭제 후 div(cloud) 생성 메소드
const deleteForm = () => {
  formBox.remove();
  const cloud = document.createElement("div");

  placeWords();
};

// div(word) 생성 메소드
const createWordObject = (word, freq) => {
  const wordContainer = document.createElement("div");
  wordContainer.style.position = "absolute";
  wordContainer.appendChild(document.createTextNode(word));
  wordContainer.style.lineHeight = 0.8;
  wordContainer.style.fontSize = freq + "px";
  wordContainer.style.paddingTop = "10px";
  wordContainer.style.textAnchor = "middle";
  // wordContainer.style.transform =
  //   "translate(300px, 200px) rotate(" + rotate + "deg)";

  // freq 따라서 랜덤 색? 0~10 10~20 20~30 30~40 40~50
  if (freq > 0 && freq < 3) {
    wordContainer.style.color = "red";
  } else if (freq >= 3 && freq < 20) {
    wordContainer.style.color = "blue";
  } 

  return wordContainer;
};

//
const placeWord = (word, x, y) => {
  smallContainer.appendChild(word);
  wordsDown.push(word.getBoundingClientRect());
  console.log(x, y);
};

//
const intersect = (word, x, y) => {
  cloud.appendChild(word);

  word.style.left = x - word.offsetWidth / 2 + "px";
  word.style.top = y - word.offsetHeight / 2 + "px";

  var currentWord = word.getBoundingClientRect();

  cloud.removeChild(word);

  for (var i = 0; i < wordsDown.length; i += 1) {
    var comparisonWord = wordsDown[i];

    if (
      !(
        currentWord.right + config.xWordPadding <
          comparisonWord.left - config.xWordPadding ||
        currentWord.left - config.xWordPadding >
          comparisonWord.right + config.wXordPadding ||
        currentWord.bottom + config.yWordPadding <
          comparisonWord.top - config.yWordPadding ||
        currentWord.top - config.yWordPadding >
          comparisonWord.bottom + config.yWordPadding
      )
    ) {
      return true;
    }
  }

  return false;
};

/*  ========================================================== */

const placeWords = () => {
  console.log(arrVal);
console.log(arrKey);
  for (let i = 0; i < 20; i += 1) {
    
    let word = createWordObject(
      arrKey,
     arrVal,
      
    );
    // console.log(word);
    // for (let j = 0; j < 360 * 5; j++) {
    //   angle = 1 * i;
    //   x = (1 + angle) * Math.cos(angle);
    //   y = (1 + angle) * Math.sin(angle);
    //   placeWord(word, startPoint.x + x, startPoint.y + y);
    // }
    placeWord(word, startPoint.x, startPoint.y);
  }
  //console.log(word);
  // placeWord(word, startPoint.x + x, startPoint.y + y);
};




//---------------------------------------

let debouncer;


// form submit event 클릭시 메소드 실행
// formBox.addEventListener("submit", (event) => {
//   event.preventDefault();
//   console.log("click");
//   const text = wordArea.value;
//   console.log(text);

//   // text 가 있을 때 form 없애고 cloud 생성
//   if (text) {
//     // text 값 서버에 보내기
//     // 값 받아와서
//     deleteForm();
//   }
// });

var arrKey = new Array();

var arrVal = new Array();


formBox.addEventListener("submit", (event) => {
  event.preventDefault();

  if (debouncer) {
    // 값이 있으면 true, 없으면 false
    clearTimeout(debouncer);
  }

  debouncer = setTimeout(() => {
    const text = wordArea.value; // textArea에 입력한 값.

    if (text) {

     

      const xhr = new XMLHttpRequest();

      const url = "/news";

      xhr.onreadystatechange = () => {
        if ((xhr.readyState == 4) & (xhr.status == 200)) {
          const responseData = xhr.responseText;
          console.log(
            // `responseData: ${responseData}, type: ${typeof responseData}`
          );
          const parseJsonToObject = JSON.parse(responseData);

         
          //console.log(words);
            
          var index_r = 0;
          for (i of Object.keys(parseJsonToObject)) {
            arrKey[index_r] = i;
            index_r++;
            if(index_r == 20){
              break;
            }
          }
          
          var index_v = 0;
          for (i of Object.values(parseJsonToObject)) {
            arrVal[index_v] = i;
            index_v++;
            if(index_v == 20){
              break;
            }
          }

          deleteForm();


         

         
        }
      };

      xhr.open("POST", url);

      xhr.setRequestHeader("Content-type", "application/json");

      const requestData = {
        // typeof : object
        text,
      };
      
      deleteForm(requestData);

      jsonToString = JSON.stringify(requestData);
    

      // xhr : XMLHttpRequest
      xhr.send(jsonToString);
    } else {
      console.log("번역할 텍스트를 입력하세요.");
      // alert('번역할 텍스트를 입력하셔야죠!');
    }
  }, 500);
});
