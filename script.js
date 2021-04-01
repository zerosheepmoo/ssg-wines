
let getFilename = () => {
    let d = new Date()
    let month = '' + (d.getMonth() + 1);
    let date = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (date.length < 2) {
        date = '0' + date;
    }
    return `./data/${year}-${month}-${date}.csv`
}

let data

let loadData = (filename) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() { // 요청에 대한 콜백
        if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
            if (xhr.status === 200 || xhr.status === 201) {
                data = xhr.responseText.split("\n")
                showData(data);
            } else {
                console.error(xhr.responseText);
            }
        }
    };
    xhr.open('GET', filename);
    xhr.send();
}

let createBox = (datum) => {
    let box = document.createElement("div");
    box.className = 'box'
    let name = datum[0];
    name = name.replace(/\"/g, "");
    // 타입이 없을 경우
    let type = name.match(/(\[.*\])/);
    type = type ? type[0]: "?";

    let opts = "X";
    // 이름 대괄호를 없애기
    name = name.replace(/(\[.*\])/, "");

    // 매장 픽업일 경우 타입은 미정으로
    if (type == "[매장픽업]") {
        type = "?";
        opts = "O";
    }

    // 소괄호로 기입되어 있을 경우
    anotherType = name.match(/(\(.*\))/);
    if (anotherType) {
        type = anotherType[0];
    }

    let typeColor = '';
    if (type[1] == "레") {
        typeColor = 'red';
    }
    else if (type[1] == "화") {
        typeColor = 'gray';
    }
    else if (type[1] == "스") {
        typeColor = 'blue'
    }
    else {
        typeColor = '';
    }

    name = name.replace(/(\(.*\))/, "");

    box.innerHTML = `<div class="name">${name.trim()}</div><div class="winetype">종류: <span style="color: ${typeColor};">${type}</span></div class="is-pickup"><div>매장픽업: ${opts}</div>`
    
    // 가격 돔
    let price = document.createElement('div');
    if (!datum[1]) {
        return box;
    }
    priceData = datum[1].replace(/\"/g, "");

    price.innerHTML = `가격: ${priceData}`;
    box.appendChild(price);

    // 이미지 돔
    let img = document.createElement('img');
    img.src = "https://" + datum[2];
    box.appendChild(img);

    return box;
}

let showData = (data) => {
    let container = document.getElementById("container");
    for (let i = 1; i < data.length; i++) {
        let wineText = data[i];
        wineText = wineText.replace(/([0-9]*),([0-9*])/, '$1$2');
        let wine = wineText.split(",");
        let box = createBox(wine);
        container.appendChild(box);
    }
}

// run
document.addEventListener('DOMContentLoaded', function() {
    loadData(getFilename())
})