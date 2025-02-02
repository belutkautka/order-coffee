let fieldsCount = 1;
let fieldsets = [document.getElementsByTagName("fieldset")[0]];
let div = document.getElementsByClassName("fieldsets")[0];

cloneText = (textarea, parent) => {
    parent.getElementsByClassName("comment")[0].innerHTML = textarea.value.replace(/(срочно)|(быстрее)|(побыстрее)|(скорее)|(поскорее)|(очень нужно)/gi, "<b>$&</b>");
}

function createNewFieldSet() {
    let newFieldset = document.createElement("fieldset");
    newFieldset.setAttribute("class", "beverage");
    newFieldset.innerHTML = fieldsets[0].innerHTML;
    for (let input of newFieldset.getElementsByTagName("input")) {
        if (input.getAttribute("type") === "radio") {
            input.setAttribute("name", `milk${fieldsCount + 1}`);
        }
    }
    let id = fieldsCount++;
    newFieldset.getElementsByClassName("closeButton")[0].addEventListener("click", () => deleteFieldSet(newFieldset));
    newFieldset.getElementsByTagName("h4")[0].innerText = `Напиток №${id + 1}`;
    newFieldset.getElementsByClassName("comment")[0].innerHTML = "";
    fieldsets.push(newFieldset);
    div.appendChild(newFieldset)
    console.log(fieldsCount);
}

function deleteFieldSet(element) {
    if (fieldsCount === 1) {
        return;
    }
    let index = Number(element.getElementsByTagName("h4")[0].innerText.split(' ')[1].slice(1)) - 1;
    div.removeChild(fieldsets[index]);
    for (let i = index; i < fieldsets.length - 1; i++) {
        fieldsets[i] = fieldsets[i + 1];
    }
    for (let i = index; i < fieldsets.length - 1; i++) {
        fieldsets[i].getElementsByTagName("h4")[0].innerHTML = `Напиток №${i + 1}`;
    }
    fieldsets.pop();
    fieldsCount--;
}

function getPadezh(i) {
    let mod = i % 100;
    if (mod % 10 >= 5 || mod % 10 === 0) {
        return "напитков";
    }
    if (Math.trunc(i / 10) === 1) {
        return "напитков";
    }
    if (mod % 10 > 1 && mod % 10 <= 4) {
        return "напитка";
    }
    return "напиток";
}

function callModalWindow() {
    document.getElementById("modalWindowText").innerText = `Вы заказали ${fieldsCount} ${getPadezh(fieldsCount)}`;
    document.getElementsByClassName("overlay")[0].style.setProperty("display", "flex");
    let tbody = document.getElementsByClassName("overlay")[0].getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    const toRussian = {"usual": "обычное", "no-fat": "обезжиренное", "soy": "соевое", "coconut": "кокосовое"};
    for (let fieldset of fieldsets) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerText = fieldset.getElementsByTagName("select")[0].selectedOptions[0].textContent;
        let td2 = document.createElement("td");
        fieldset.querySelectorAll('input[type="radio"]').forEach((x) => {
            if (x.checked) {
                td2.innerText = toRussian[x.value];
            }
        });
        let td3 = document.createElement("td");
        fieldset.querySelectorAll('input[type="checkbox"]').forEach((x) => {
            if (x.checked) {
                if (td3.innerText.length !== 0) {
                    td3.innerText += ", ";
                }
                td3.innerText += x.parentElement.querySelector('span').textContent;
            }
        });

        let td4 = document.createElement("td");
        td4.innerText = fieldset.getElementsByClassName("comment")[0].textContent;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);
    }
}

function removeModalWindow() {
    document.getElementsByClassName("overlay")[0].style.setProperty("display", "none");
    document.querySelector('input[type="time"]').style.background = '';
}

document.getElementById("modalWindowCloseButton" + "").addEventListener("click", () => removeModalWindow());
document.getElementsByClassName("overlay")[0].style.setProperty("display", "none");
document.getElementsByClassName("closeButton")[0].addEventListener("click", () => deleteFieldSet(fieldsets[0]));
document.getElementsByClassName("add-button")[0].addEventListener("click", () => createNewFieldSet());
document.getElementsByClassName("submit-button")[0].addEventListener("click", () => callModalWindow());
document.getElementsByClassName("orderButton")[0].addEventListener("click", () => {
    let time = document.getElementById('time').value.split(':');
    let h = time[0];
    let m = time[1];
    let nH = new Date().getHours();
    let nM = new Date().getMinutes();

    if (h > nH || m > nM) {
        if (h > nH)
            removeModalWindow();
        else if (h === nH && m >= nM)
            removeModalWindow();
    } else {
        document.querySelector('input[type="time"]').style.background = 'red';

    }
});