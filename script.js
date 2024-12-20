import { wordList } from "./main/wordList.js";

window.onload = function () {
    const slider = document.getElementById('word-slider');

    let groupNumber = parseInt(wordList.length / 10);
    let restNumber = wordList.length % 10;

    if (restNumber > 0) {
        groupNumber++;
    }

    slider.max = groupNumber;
    updateLabel(slider.value);
    normalBgColor(slider.value);

    slider.addEventListener('input', function () {
        updateLabel(this.value);
    });

    slider.addEventListener("mouseover", function () {
        overBgColor(slider.value);
    })

    slider.addEventListener("mouseout", function () {
        normalBgColor(slider.value);
    })
}

function normalBgColor(value) {
    const slider = document.getElementById('word-slider');
    const min = slider.min;
    const max = slider.max;
    const percentage = ((value - min) / (max - min)) * 100;

    // 前面的颜色为渐变色，后面的部分为灰色
    slider.style.background = `linear-gradient(to right, #99e699, #66cccc, #87ceeb ${percentage}%, #ddd ${percentage}%)`;
}

function overBgColor(value) {
    const slider = document.getElementById('word-slider');
    const min = slider.min;
    const max = slider.max;
    const percentage = ((value - min) / (max - min)) * 100;

    // 前面的颜色为渐变色，后面的部分为灰色
    slider.style.background = `linear-gradient(to right, #66cc66, #33bbbb, #70c0ee ${percentage}%, #ccc ${percentage}%)`;
}

function updateLabel(value) {
    const slider = document.getElementById('word-slider');
    const label = document.getElementById('slider-label');

    if (value == 0) {
        value = 1;
        slider.value = 1;
    }

    // 更新标签上的数值
    label.textContent = `group ${value}`;
    overBgColor(slider.value);
}

function startPractice() {
    const selectedNumber = document.getElementById('word-slider').value;
    window.location.href = `main/main.html?group=${selectedNumber}`;
}

window.startPractice = startPractice;
