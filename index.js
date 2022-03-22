let getNumber = (min, max) => Math.round(Math.random() * (max - min) + min);
    
let arrFruits = ['fruit-1', 'fruit-2', 'fruit-3', 'fruit-4', 'fruit-5', 'fruit-6', 'fruit-7', 'fruit-8', 'fruit-9', 'fruit-10', 'fruit-11', 'fruit-12', 'fruit-13', 'fruit-14', 'fruit-15', 'fruit-16', 'fruit-17', 'fruit-18', 'fruit-19', 'fruit-20'];
let arrElems = 6; //arr.length;
let counts = 2;
let newArr = [];

let fruits = document.querySelector('#fruits');

let ids = []; // cards ids
let maxIds = counts; // maximum cards for compare
let elems = []; // elements whitch we will be add class
let cards = 0; // sum of correct cards
let loadCards = 0; // max cards for compare

function game() {
    let arr = []; // list of our chosen fruits
    let temp = [];

    // if we decided to choose less fruits than array has.
    if(arrElems < arrFruits.length) {
        
        /*
        for(let j = 0; j < arrElems; j++) {
            let l1 = arrFruits[getNumber(0, arrFruits.length - 1)];
            if(temp.indexOf(l1) === -1 || !temp.length) {
                temp.push(l1);
            }else {
                j--;
            }
        }
        arr = temp.slice();
        */
       
        let number = getNumber(0, arrFruits.length - 1);

        if(number + arrElems > arrFruits.length) {
            let num1 = arrFruits.length - number;
            let num2 = arrElems - num1;
            arr = [...arrFruits.splice(number, num1), ...arrFruits.splice(0, num2)];
        }else {
            arr = arrFruits.slice(number, arrElems + number);
        }

    }else {
        // used slice for copy, not just for link
        arr = arrFruits.slice();
    }

    newArr = [];
    for(let i = 0; i < arrElems * counts; i++) {
        let item = arr[getNumber(0, arr.length - 1)];
        let regexp = new RegExp("\\b" + item + "\\b", "g");
        
        if(!newArr.length) { newArr.push(item); continue; }

        
        if(!newArr.join(',').match(regexp)) {
            newArr.push(item);
        }else if(newArr.join(',').match(regexp).length <= counts - 1) {
            newArr.push(item);
        }else {
            
            // when the range so small we have to delete those elements which we have already added
            // for the reason that random function sometimes get old id element and
            // we have a chance to get infinity loop
            if(arr.length > 1) {
                arr.splice(arr.indexOf(item), 1);
                i--;
            }
        }
    }
    
    generateCards();
}
game();
// ------------------------------



// ---------------

function generateCards() {
    loadCards = newArr.length;
    fruits.innerHTML = "";
    let fruitDivFragment = document.createDocumentFragment('div');
    for(let i = 0; i < loadCards; i++) {
        let div = document.createElement("div");
        div.setAttribute('class', 'card');
        div.innerHTML = `
            <div class="cardBlockInside">    
                <div class="${newArr[i]}"></div>
                <div class="back" data-id="${/[0-9]+/.exec(newArr[i])[0]}"></div>
            </div>
        `;
        fruitDivFragment.appendChild(div);
    }
    fruits.appendChild(fruitDivFragment);
}

// ---------------

fruits.addEventListener("click", e => {
    let elem = e.target;
    
    // check if element has id. back has, front hasn't
    if(!elem.dataset.id || ids.length === maxIds) return;

    // set '.flip' class block
    let className = 'flip';
    let arrClass = elem.parentNode.getAttribute('class').split(' ');
    if(arrClass.indexOf(className) === -1) {
        arrClass.push(className);
    }
    elem.parentNode.setAttribute('class', arrClass.join(' '));
    // ----

    
    let id = elem.dataset.id;
    if(ids.length < maxIds) {
        ids.push(elem.dataset.id);
        elems.push(elem.parentNode);
    }

    if(ids.length === maxIds) {
        let firstIds = ids[0];
        // store the first id and compare with others ids from the ids array
        // if filter return empty array that means all cards the same
        if(ids.filter(id => firstIds !== id).length) {
            cardsSame(false, won);
        }else {
            cardsSame(true, won);
        }
    }

    function won(cardsLen) {
        // wait for when all cards will be hidden on the field
        setTimeout(() => {
            if(cardsLen === loadCards) {
                alert("Congratulations!\r\nYou won.");

                cards = 0;
                game();
            }
        }, 500);
    }

    function cardsSame(state, callback) {
        setTimeout(function() {
            for(let i = 0; i < elems.length; i++) {
                if(state) {
                    elems[i].parentNode.setAttribute('class', elems[i].parentNode.getAttribute('class') + ' same');
                    elems[i].parentNode.removeChild(elems[i]);
                }else {
                    let classStr = elems[i].getAttribute('class').split(' ').filter(i => i != 'flip');
                    elems[i].setAttribute('class', classStr);
                }

                if(i === elems.length - 1) {
                    elems = [];
                    ids = [];
                    
                    if(state) {
                        cards += maxIds;
                        callback(cards);
                    }
                }
            }

        }, 1000);
    }
});

// block for mobile
// when we change landscape orientation to portrait or vice versa
// we must change height, width of each blocks etc.
// and we center our fruits block

let resizeFruits = () => {
    let blockWidth = fruits.querySelector('div').offsetWidth;
    let maxItems = Math.floor(fruits.clientWidth / blockWidth);
    let spaceBetween = (fruits.clientWidth - maxItems * blockWidth) / (maxItems - 1);

    let columns = Math.ceil(fruits.querySelectorAll(':scope > div').length / maxItems);
    
    let height = (columns * blockWidth + (columns - 1) * spaceBetween);

    let fruitsW = fruits.offsetWidth;
    fruits.setAttribute("style",`height:${height}px;position:absolute;left:50%;top:50%;margin-left:-${fruitsW/2}px;margin-top:-${height/2}px`);
};
resizeFruits();

window.addEventListener("resize", () => {
    resizeFruits();
});
