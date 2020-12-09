const encryptBtn = document.getElementById("encrypt-text"),
    reflectorSelect = document.getElementById("reflector-select"),
    plugboardSelect = document.getElementById("plugboard-select"),
    rotorSelects = document.querySelectorAll(".rotor-select"),
    positionInputs = document.querySelectorAll(".position-input"),
    ringInputs = document.querySelectorAll(".ring-input"),
    stepDownBtns = document.querySelectorAll(".step-down"),
    stepUpBtns = document.querySelectorAll(".step-up"),
    userTextInput = document.querySelector(".user-text"),
    resultTextInput = document.querySelector(".result-text"),
    reflectorsList = [
        "EJMZALYXVBWFCRQUONTSPIKHGD",
        "YRUHQSLDPXNGOKMIEBFZCWVJAT",
        "FVPJIAOYEDRZXWGCTKUQSBNMHL"],
    rotorsList = [
        "EKMFLGDQVZNTOWYHXUSPAIBRCJ", 
        "AJDKSIRUXBLHWTMCQGZNPYFVOE",
        "BDFHJLCPRTXVZNYEIWGAKMUSQO",
        "ESOVPZJAYQUIRHXLNFTGKDCMWB",
        "VZBRGITYUPSDNHLXAWMJQOFECK",
        "JPGVOUMFYQBENHZRDKASXLICTW",
        "NZJHGRCXMYSWBOUFAIVLPEKQDT",
        "FKQHTLXOCBJSPDZRAMEWNIUYGV"],
    notchList = ["Q", "E", "V", "J", "Z", "ZM", "ZM", "ZM"],
    alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

var currentReflector = reflectorsList[1],
        currentPlugboard = "AO HI MU SN VX ZQ",
        currentRotorsList = [rotorsList[0],rotorsList[1],rotorsList[2]],
        currentNotchList = [notchList[0],notchList[1],notchList[2]],
        currentUserText = "";

function getCurrentArray(input){
    switch(input.id){
        case "position1":
            currentArray = currentRotorsList[0];
            break;
        case "position2":
            currentArray = currentRotorsList[1];
            break;
        case "position3":
            currentArray = currentRotorsList[2];
            break;
    }
    return currentArray;
}
function plugboardCheckAndUpdate(){
    const warningEl = document.querySelector(".warning"),
    plugboardCheck = plugboardSelect.value.trim().toUpperCase().split(" "),
    plugboardUniqueCheck = plugboardSelect.value.toUpperCase().replace(/ /g,'').split("");
    let plugError = false, plugEroroMessage = "";
    //Check if plugboard contais proper pairs, unless its blank
    for (pair of plugboardCheck){
        if(pair.length!=2 && pair.length!=0){
            plugError = true;
            plugEroroMessage="invalid plugboard format: pairs of letters expected (eg. 'AO HI')"
            break;
        } 
        else{
            plugError=false
        }
    }
    //Check if plugboard is unique
    if((new Set(plugboardUniqueCheck)).size !== plugboardUniqueCheck.length){
        plugError=true
        plugEroroMessage="pairs of letters need to be unique"
    }
    //Block user from running wrong configuration
    if (plugError){
        encryptBtn.disabled = true;
        warningEl.classList.remove("hidden")
        warningEl.innerHTML = plugEroroMessage;
    }
    else{
        encryptBtn.disabled = false;
        warningEl.classList.add("hidden");
        currentPlugboard = plugboardSelect.value.replace(/  +/g, ' ').toUpperCase();
    }
}
function focuseOutComplete(input,array){
    if (input.value== ""){
        input.value = "A"
    }
    const correctValue = array.indexOf(input.value.toUpperCase())+1;
    input.previousElementSibling.innerHTML = correctValue
}
function refreshPositionInputs(rowToUpdate){
    //Refresh values after Rotor is changed
    const pInput = positionInputs[rowToUpdate];
    const pNum = pInput.previousElementSibling;
    pNum.innerHTML = currentRotorsList[rowToUpdate].indexOf(pInput.value.toUpperCase())+1;
}
function StepUp(element,array){
    const pRing = element.parentElement.querySelector(".position-number"),
    elementInput = element.parentElement.querySelector("input");
    let ringNr =  parseInt(pRing.innerText);
    if (ringNr==alphabet.length){
        ringNr=0;
    } 
    elementInput.value = array[ringNr];
    pRing.innerText = ringNr+1;
}
function StepDown(element,array){
    const pRing = element.parentElement.querySelector(".position-number"),
    ringInput = element.parentElement.querySelector("input");
    let ringNr =  parseInt(pRing.innerText);
    if (ringNr==1){
        ringNr=27;
    } 
    ringInput.value = array[ringNr-2];
    pRing.innerText = ringNr-1;
}
function romanToArabic(n){
    const romanNumList = ["I","II","III","IV","V","VI","VII","VIII"];
    return romanNumList.indexOf(n);
}
reflectorSelect.addEventListener("change",()=>{
    // Choose correct reflector from reflector list
    switch (reflectorSelect.options[reflectorSelect.selectedIndex].text) {
        case "UKW-A":
            currentReflector = reflectorsList[0];
            break;
        case "UKW-B":
            currentReflector = reflectorsList[1];
            break;
        case "UKW-C":
            currentReflector = reflectorsList[2];
            break;
    }
})
plugboardSelect.addEventListener("input",()=>{
    // Check if plugboard is correct and update
    plugboardCheckAndUpdate()
})
rotorSelects.forEach((select)=>{
    select.addEventListener("change",()=>{
        const roman = select.options[select.selectedIndex].text;
        const currentRotorNum = [romanToArabic(roman)];
        var rowToUpdate;
        switch(select.previousElementSibling.innerHTML){
            case "Rotor 1":
                currentRotorsList[0] = rotorsList[currentRotorNum];
                currentNotchList[0] = notchList[currentRotorNum];
                rowToUpdate = 0;
                break
            case "Rotor 2":
                currentRotorsList[1] = rotorsList[currentRotorNum];
                currentNotchList[1] = notchList[currentRotorNum];
                rowToUpdate = 1;
                break;
            case "Rotor 3":
                currentRotorsList[2] = rotorsList[currentRotorNum];
                currentNotchList[2] = notchList[currentRotorNum];
                rowToUpdate = 2;
                break;
        }
        refreshPositionInputs(rowToUpdate);
    })
})

positionInputs.forEach((input)=>{
    input.addEventListener("focus",()=>{
        input.previousElementSibling.innerHTML = "";
    })
    input.addEventListener("focusout",()=>{
        focuseOutComplete(input,array = getCurrentArray(input));
    })
})
ringInputs.forEach((input)=>{
    input.addEventListener("focus",()=>{
        input.previousElementSibling.innerHTML = "";
    })
    input.addEventListener("focusout",()=>{
        focuseOutComplete(input,alphabet);
    })
    
})
userTextInput.addEventListener("input",()=>{
    currentUserText = userTextInput.value.toUpperCase() ;
})

stepUpBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        // Position input/ring input ++
        const label = btn.parentElement.previousElementSibling.innerHTML;
        switch(label){
            case "position":
                const currentArray = getCurrentArray(btn.parentElement.querySelector("input")); 
                StepUp(btn,currentArray);
                break;
            case "ring":
                StepUp(btn,alphabet);
                break;
        }
    })
})
stepDownBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        // Position input/ring input --
        const label = btn.parentElement.previousElementSibling.innerHTML;
        switch(label){
            case "position":
                const currentArray = getCurrentArray(btn.parentElement.querySelector("input"));
                StepDown(btn,currentArray);
                break;
            case "ring":
                StepDown(btn,alphabet);
                break;
        }
    })
})
encryptBtn.addEventListener("click",()=>{
    const 
    positionsKey = [positionInputs[0].value,positionInputs[1].value,positionInputs[2].value].map(key => key.toUpperCase()),
    ringsKey = [ringInputs[0].value,ringInputs[1].value,ringInputs[2].value].map(key => key.toUpperCase())
    enimgaEncrypt = new Enigma(currentRotorsList,currentReflector,currentNotchList,positionsKey,ringsKey);
    resultTextInput.innerHTML = enimgaEncrypt.runEnigma();
})
class Enigma{
    constructor(rotorsList,reflector,notchList,positionsKey,ringsKey){
        this.rotorsList = [this.convertToArray(rotorsList[0]),this.convertToArray(rotorsList[1]),this.convertToArray(rotorsList[2])];
        this.reflector = this.convertToArray(reflector);
        this.notchList = [notchList[0],notchList[1],notchList[2]];
        this.positionsKey = positionsKey;
        this.ringsKey = ringsKey; 
        this.rotorsAlphabetList=["ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
    }
    convertToArray(string){
        //Convert to Array
        return string.split("");
    }
    rotateArrayToLeft(array,shift){
        //[a,b,c] = [b,c,a]
        let newArray = array;
        while(shift--){
            const shiftItem = newArray.shift();
            newArray.push(shiftItem);
        }
        return newArray;
    }
    rotateArrayToRight(array,shift){
        //[a,b,c] = [c,b,a]
        let newArray = array;
        while(shift--){
            const shiftItem = newArray.pop();
            newArray.unshift(shiftItem);
        }
        return newArray;
    }
    caesarEncrypt(text,shift){
        const alphabetShift = this.rotateArrayToLeft("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),shift);
        const caesarMessage = [];
        for (const letter of text){
            caesarMessage.push(alphabetShift["ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(letter)]);
        }
        return caesarMessage;
    }
    rotateWholeRotor(index,shift){
        //Whole Rotor = rotor alphabet + normal alphabet
        this.rotorsList[index] = this.rotateArrayToLeft(this.rotorsList[index],shift);
        this.rotorsAlphabetList[index] = this.rotateArrayToLeft(this.rotorsAlphabetList[index],shift);
    }
    setRingConfiguration(){
        // Set ring Settings (ring key)
        this.ringsKey.forEach((letter,index)=>{
            const letterIndex = alphabet.indexOf(letter);
            const shiftedRotor = this.caesarEncrypt(this.rotorsList[index],letterIndex);
            this.rotorsList[index] = this.rotateArrayToRight(shiftedRotor,letterIndex);
        })
        // Set ring Positions (position key)
        this.positionsKey.forEach((letter,index)=>{
            const shift = alphabet.indexOf(letter);
            this.rotateWholeRotor(index,shift);
        })
    }
    rotorsRotationMechanism(){
        if (this.notchList[2].includes(this.rotorsAlphabetList[2][0])){
            if (this.notchList[1].includes(this.rotorsAlphabetList[1][0])){
                // left rotor is rotated
                this.rotateWholeRotor(0,1);
            }
            //  middle rotor is rotated
            this.rotateWholeRotor(1,1);
        }
        else{
            // Check double step sequence
            if (this.notchList[1].includes(this.rotorsAlphabetList[1][0])){
                this.rotateWholeRotor(1,1);
                this.rotateWholeRotor(0,1);
            }
        }
        // Right rotor is always rotated
        this.rotateWholeRotor(2,1);
    }
    generateplugboardDictionary(){
        const plugboardDictionary = {}
        currentPlugboard.split(" ").forEach((item)=>{
            plugboardDictionary[item[0]] = item[1];
            plugboardDictionary[item[1]] = item[0];
        })
        return plugboardDictionary;
    }
    runEnigma(){
        var finalMessage = "";
        this.setRingConfiguration();
        const plugboardDictionary = this.generateplugboardDictionary();
        for (var letter of currentUserText.toUpperCase()){
            if(!alphabet.includes(letter)){
                finalMessage += letter;
                continue;
            }
            //Rotots are roated before any other process
            this.rotorsRotationMechanism();
            //Plugboard 1 Switch
            if(currentPlugboard.includes(letter)){
                letter = plugboardDictionary[letter];
            }
            //Encryption proces - letters go from Right Rotor to Reflector
            var letterCord = alphabet.indexOf(letter);
            for(let index=2;index>=0;index--){
                letter = this.rotorsList[index][letterCord];
                letterCord = this.rotorsAlphabetList[index].indexOf(letter);
            }
            //Encryption proces - Reflector
            const reflectedLetter = this.reflector[letterCord];
            letterCord = alphabet.indexOf(reflectedLetter);
            //Encryption proces - letter go from Reflector to Right Rotor
            for(let index=0;index<=2;index++){
                letter = this.rotorsAlphabetList[index][letterCord];
                letterCord = this.rotorsList[index].indexOf(letter);
            }
            let encryptedLetter = alphabet[letterCord];
            //Plugboard 2 Switch
            if(currentPlugboard.includes(encryptedLetter)){
                encryptedLetter = plugboardDictionary[encryptedLetter];
            }
            finalMessage+=encryptedLetter;
        }
        return finalMessage;
    }
}