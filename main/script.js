import { wordList } from "./wordList.js";

let selectedWords = [];
let currentIndex = 0;
let correctAnswers = {};
let correctNumber = 0;
let bingo = true;

const submit = document.getElementById("submit");
const practiceView = document.getElementById('practice-view');
const inputLine = document.getElementById("input-line");
const feedback = document.getElementById("feedback");
const inputContainer = document.getElementById("input-container");

inputLine.addEventListener("focus", function () {
    inputLine.classList.add("focused");
});

inputLine.addEventListener("blur", function () {
    inputLine.classList.remove("focused");
});

inputLine.addEventListener("input", function () {
    // 定义字体大小的数组（从大到小）
    const fontSizes = [24, 18, 14];   // 分别表示正常、偏小、最小的字体大小
    const thresholds = [
        20,  // 第一分段的阈值
        27,  // 第二分段的阈值
    ];  // 阈值与字体大小数组相对应

    // 根据输入宽度判断应该使用哪一个字体大小
    if (inputLine.innerText.length <= thresholds[0]) {
        this.style.fontSize = fontSizes[0] + "px";  // 使用正常大小
    } else if (inputLine.innerText.length > thresholds[0] && inputLine.innerText.length <= thresholds[1]) {
        this.style.fontSize = fontSizes[1] + "px";  // 使用偏小大小
    } else if (inputLine.innerText.length > thresholds[1]) {
        this.style.fontSize = fontSizes[2] + "px";  // 使用最小字体
    }
});

// 初始化页面
function init() {
    practiceView.classList.remove('hidden');
    practiceView.classList.add('fade-in');

    getWords();
    createCircles();
    displayWord();

    submit.addEventListener("click", function () {
        if (submit.textContent === "提交") {
            checkAnswer();
        }
        else if (submit.textContent === "下一个") {
            nextWord();
        } else if (submit.textContent === "再次练习") {
            location.reload();
        }
    });

    inputLine.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            checkAnswer();
        } else if (window.getComputedStyle(this).color === "rgb(255, 0, 0)") {
            inputLine.style.fontSize = 24 + "px";
            this.innerText = "";
            this.style.color = "black";
            feedback.innerHTML = "";
        }
    });

    this.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (submit.textContent === "下一个") {
                nextWord();
            } else if (submit.textContent === "再次练习") {
                location.reload();
            }
        }
    }, true)
}

// 创建小圆圈
function createCircles() {
    const circlesContainer = document.getElementById('circles');
    for (let i = 0; i < selectedWords.length; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circlesContainer.appendChild(circle);
    }
}

// 更新小圆圈的状态
function updateCircles(index, singal) {
    const circles = document.querySelectorAll('.circle');
    // current 5; check 6
    if (singal === 5) {
        circles[index].classList.remove('wrong');
        circles[index].classList.add('active');
    } else if (singal === 6 && selectedWords[index] === '✔') {
        circles[index].classList.remove('active');
        circles[index].classList.add('completed');
    } else if (singal === 6) {
        circles[index].classList.remove('active');
        circles[index].classList.add('wrong');
    }
}

// 获取URL参数
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 选择题目组
function getWords() {
    const index = (parseInt(getQueryParameter('group')) || 1) - 1; // 默认为第一组;
    selectedWords = wordList.slice(index * 10, index * 10 + 10);
    document.getElementById("word-counter").textContent = `${correctNumber} / ${selectedWords.length}`;
}

// 显示当前搭配的中文释义和本次练习进度
function displayWord() {
    // 跳过已经正确的题目
    while (selectedWords[currentIndex] === "✔" && correctNumber !== selectedWords.length) {
        currentIndex = (currentIndex + 1) % selectedWords.length;
    }

    if (correctNumber !== selectedWords.length) {
        const chineseMeaning = selectedWords[currentIndex].meaning;
        correctAnswers = selectedWords[currentIndex].word;
        document.getElementById("chinese-meaning").textContent = chineseMeaning;
        feedback.textContent = "";
        updateCircles(currentIndex, 5);     // current 5; check 6
    }
}

// 检查用户输入
function checkAnswer() {
    const input = inputLine.innerText.replace(/[^a-zA-Z]/g, '').toLowerCase().replace(/sb|sth/g, '');
    const correctAnswerscmp = correctAnswers.replace(/[^a-zA-Z]/g, '').toLowerCase().replace(/sb|sth/g, '');
    let correct = (input === correctAnswerscmp);

    if (correct) {
        inputLine.innerText = correctAnswers;
        inputLine.setAttribute("contenteditable", "false");
        inputLine.style.color = "green";
    } else {
        // 移除抖动效果
        inputLine.classList.remove('shake');
        // 强制浏览器重绘
        void inputLine.offsetWidth;
        // 再次添加抖动效果
        inputLine.classList.add('shake');
        inputLine.style.color = "red";
    }
    inputLine.blur();

    if (correct) {
        if (bingo) {
            selectedWords[currentIndex] = "✔"; // 将正确的题目替换为 ✔
            correctNumber++;
            document.getElementById("word-counter").textContent = `${correctNumber} / ${selectedWords.length}`;
        }

        if (correctNumber !== selectedWords.length) {
            submit.textContent = "下一个";
        } else {
            inputLine.blur();
            feedback.innerHTML = "恭喜你，成功通关！";
            feedback.style.color = "green";
            submit.textContent = "再次练习";
        }
    } else {
        bingo = false;
        feedback.innerHTML = `错误，请修正！<br>答案: ${correctAnswers}`;
        feedback.style.color = "red";
    }
    updateCircles(currentIndex, 6);     // current 5; check 6
}

function nextWord() {
    inputLine.style.fontSize = 24 + "px";   // 还原字体大小
    inputContainer.classList.add('fade-out');   // 添加淡出效果

    setTimeout(() => {
        inputLine.innerText = "";
        inputLine.setAttribute("contenteditable", "true");
        inputLine.style.color = "black";

        submit.textContent = "提交";
        currentIndex = (currentIndex + 1) % selectedWords.length;
        bingo = true;
        inputLine.focus();

        displayWord();
        inputContainer.classList.remove('fade-out');
        inputContainer.classList.add('fade-in');

        // 移除fade-in类，避免后续切换时影响动画
        setTimeout(() => inputContainer.classList.remove('fade-in'), 200);
    }, 200); // 等待淡出动画完成
}

window.onload = init;
