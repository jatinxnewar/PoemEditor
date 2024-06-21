function updatePoem() {
    const poemText = document.getElementById('poem-input').value.replace(/\n/g, '<br>');
    const poetName = document.getElementById('poet-name').value;
    const font = document.getElementById('font-select').value;
    const fontSize = document.getElementById('font-size').value;
    const fontColor = document.getElementById('font-color').value;
    const bgColor = document.getElementById('bg-color').value;

    const poemDisplay = document.getElementById('poem-display');
    poemDisplay.style.fontFamily = font;
    poemDisplay.style.fontSize = fontSize + 'px';
    poemDisplay.style.color = fontColor;
    poemDisplay.style.backgroundColor = bgColor;
    poemDisplay.style.padding = '20px';
    poemDisplay.style.borderRadius = '10px';

    poemDisplay.innerHTML = poemText + `<div class="poet-signature">~${poetName}</div>`;
}

function downloadPoem() {
    alert("Please take a screenshot of your beautiful poem");
}
