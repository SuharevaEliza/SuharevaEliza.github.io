var DROPDOWN_VALUES = {
    nullValues : ['string', 'int', 'long', 'double', 'date'],
    textValues: ['boolean', 'bucket', 'enum', 'array']
};
var ROW_TEMPLATE = document.getElementById('row-template');
var ROW_COUNT = 0;
var DATA_COLLECTION = {};

populateDropdownOptions();
addNewRow();
setPageButtonListeners();

function populateDropdownOptions() {
    var select = ROW_TEMPLATE.querySelector('select');
    var option = select.querySelector('option');

    DROPDOWN_VALUES.nullValues.concat(DROPDOWN_VALUES.textValues).forEach((dropdownValue) => {
        var newOption = option.cloneNode(true);
        newOption.value = dropdownValue;
        newOption.textContent = dropdownValue;
        select.appendChild(newOption);
    });
}

function addNewRow(){
    var newRow = ROW_TEMPLATE.cloneNode(true);
    var table = document.getElementById('table-body');

    ROW_COUNT++;
    newRow.id = 'row' + ROW_COUNT;
    newRow.dataset.index = ROW_COUNT;
    table.appendChild(newRow);
    configureNewRow(newRow);
    createDataObject(ROW_COUNT);
}

function configureNewRow(row) {
    row.classList.remove('hidden');
    row.classList.remove('row-template');
    addRowRemover(row);
    addSelectionListener(row);
    addInputListener(row);
}

function createDataObject(rowID, optionID){
    var rowElements = 5;
    var index = 0;
    if(optionID) index = optionID;

    DATA_COLLECTION[rowID] = DATA_COLLECTION[rowID] || {};
    DATA_COLLECTION[rowID][index] = new Array();
    for(i=0; i<rowElements; i++){
        DATA_COLLECTION[rowID][index][i] = 'NULL';
    }
}

function addRowRemover(row){
    var removeButton = row.querySelector('.remove-row');
    var objectID = row.dataset.index;

    if(objectID > 1){
        removeButton.classList.remove('hidden');
        removeButton.addEventListener('click', () => {
            row.parentElement.removeChild(row);
            deleteRowData(objectID)
        });
    }
}

function deleteRowData(objectID){
    Object.keys(DATA_COLLECTION).forEach((ind)=>{
        if(ind.indexOf(objectID)>-1) delete DATA_COLLECTION[ind];
    });
}

function addSelectionListener(row) {
    var select = row.querySelector('select');
    var sourceValue = row.querySelector('.source-value');
    var displayValue = row.querySelector('.display-value');

    select.addEventListener('change', () => {
        var selectedValue = select.selectedOptions[0].value;
        if(selectedValue === 'boolean'){
            removeExistingOptions(row);
            setBoolOption(sourceValue, displayValue);
        }
        else if(DROPDOWN_VALUES.textValues.indexOf(selectedValue) > -1){
            toggleInputValueFields(sourceValue, displayValue, false, '', row);
            enableAddingOption(row);
        } else {
            toggleInputValueFields(sourceValue, displayValue, true, 'NULL', row);
            removeExistingOptions(row);
        }
    })
}

// MULTI-OPTION

function toggleInputValueFields(sourceValue, displayValue, disabled, placeholder, row){
    sourceValue.disabled = displayValue.disabled = disabled;
    sourceValue.placeholder = displayValue.placeholder = placeholder;
    sourceValue.value = displayValue.value = placeholder;

    if(sourceValue.value.toLowerCase() === 'true' || sourceValue.value.toLowerCase() === 'null') {
        wipeOptionsDataSet(row);
    }

    removeBoolOptions(row);
}

function disableAddingOption(row){
    var addButton = row.querySelector('.add-option-container')
    if(addButton) addButton.parentElement.removeChild(addButton);
}

function removeExistingOptions(row){
    [].slice.call(row.querySelectorAll('.source-value-container:not([data-index="0"]), .display-value-container:not([data-index="0"])')).forEach((el) => {
        if(el) el.parentElement.removeChild(el);
    });
    wipeOptionsDataSet(row);
    disableAddingOption(row);
}

function wipeOptionsDataSet(row){
    var rowID = row.dataset.index;
    Object.keys(DATA_COLLECTION[rowID]).forEach((object) => {
        if (object > 0) delete  DATA_COLLECTION[rowID][object]
        else {
            DATA_COLLECTION[rowID][object][3] = DATA_COLLECTION[rowID][object][4] = 'NULL';
        }
    })
}

function removeBoolOptions(row){
    [].slice.call(row.querySelectorAll('.boolean')).forEach((el) => {
        if(el) el.parentElement.removeChild(el);
    })
}

function enableAddingOption(row){
    if(!row.querySelector('.add-option')){
        var newOptionButton = document.querySelector('.add-option-container.template').cloneNode(true);
        newOptionButton.classList.remove('template');
        row.querySelector('.data-type-container').appendChild(newOptionButton);
        newOptionButton.classList.remove('removed');
        newOptionButton.addEventListener('click', addNewOption);
    }
}

function addNewOption(){
    var row = getParent(this, '.crm-row');
    var rowID = row.dataset.index;
    var sourceValues = [].slice.call(row.querySelectorAll('.source-value-container'));
    var displayValues = [].slice.call(row.querySelectorAll('.display-value-container'));
    var optionID = sourceValues.length;

    var newSourceValue = createNewInput(sourceValues)
    var newDisplayValue = createNewInput(displayValues) 
    newDisplayValue.querySelector('.display-value-container--remove').classList.remove('hidden');
    
    sourceValues[0].parentElement.appendChild(newSourceValue);
    displayValues[0].parentElement.appendChild(newDisplayValue);

    createDataObject(rowID, displayValues.length);
    addInputListener(row, optionID);
    setRemoveOptionListener(row, displayValues.length);
}

function createNewInput(sourceInputs){
    var newInputBlock = sourceInputs[0].cloneNode(true);
    var newInput = newInputBlock.querySelector('input');
    newInputBlock.dataset.index = sourceInputs.length;
    newInput.value = '';
    return newInputBlock
}

function setRemoveOptionListener(row, optionID){
    var removeOptionButton = row.querySelector('[data-index="' + optionID + '"] > .display-value-container--remove');
    removeOptionButton.addEventListener('click', removeOption);
}

function removeOption(){
    var opntionId = this.parentElement.dataset.index;
    var row = getParent(this, '.crm-row');
    var rowID = row.dataset.index;

    [].slice.call(row.querySelectorAll('[data-index="' + opntionId + '"]')).forEach(field => {
        field.remove();
        delete DATA_COLLECTION[rowID][opntionId];
    })
}

function createOptionDataSet(row){
    var displayName = row.querySelector('[name="display-name"]').value;
    var columnName = row.querySelector('[name="column-name"]').value;
    var type = row.querySelector('[name="data-type"]').value;
    var sourceValues = row.querySelectorAll('.source-value');
    var displayValues = row.querySelectorAll('.display-value');
    var sourceValue = sourceValues[sourceValues.length-1].value;
    var displayValue = displayValues[sourceValues.length-1].value;

    return [displayName, columnName, type, sourceValue, displayValue];
}

// BOOLELAN

function setBoolOption(sourceValue, displayValue){
    var sourceContainer = sourceValue.parentElement;
    var displayContainer = displayValue.parentElement;

    var newSourceContainer = createNewBoolOption(sourceContainer, 'False', true)
    var newDisplayContainer = createNewBoolOption(displayContainer, '', false);

    configureOldBoolOption(sourceValue, 'True', true);
    configureOldBoolOption(displayValue, '', false);

    sourceContainer.parentElement.appendChild(newSourceContainer);
    displayContainer.parentElement.appendChild(newDisplayContainer);

    addInputListener(getParent(sourceValue, '.crm-row'), newDisplayContainer.dataset.index);
}

function createNewBoolOption(elementToCopy, value, disable){
    var newElementContainer = elementToCopy.cloneNode(true);
    newElementContainer.dataset.index = 1;
    var newElementValue = newElementContainer.querySelector('input');

    newElementContainer.classList.add('boolean');
    newElementValue.value = value;
    newElementValue.placeholder = value;
    newElementValue.disabled = disable;
    
    return newElementContainer;
}

function configureOldBoolOption(element, placeholder, disabled){
    element.value = placeholder;
    element.placeholder = placeholder;
    element.disabled = disabled;
}

function addInputListener(row, optionID){
    var actions = {
        'INPUT':'keyup',
        'SELECT':'change'
    }
    var rowID = row.dataset.index;
    optionID = optionID || 0;
    var inputs = [];

    if (optionID){
        inputs = [].slice.call(row.querySelectorAll(
            '.source-value-container[data-index="' + optionID + '"] input,' +
            '.display-value-container[data-index="' + optionID + '"] input'
        ));
    } else {
        inputs = [].slice.call(row.querySelectorAll('input, select'));
    }

    inputs.forEach((input, index) => {
        if(inputs.length < 3){
            setDefaultOptionValues(rowID, optionID)
            index += 3;
        }

        input.addEventListener(actions[input.tagName], () => {
            input.classList.remove('invalid');
            updateDataObjectOnUserInput(rowID, optionID, index, input);
        });
    });
}

function updateDataObjectOnUserInput(rowID, optionID, index, input){
    var childOptionsCount = parseInt(Object.keys(DATA_COLLECTION[rowID]).length);

    DATA_COLLECTION[rowID][optionID][index] = input.value;

    if(index < 3 && childOptionsCount > 0){
        updateChildOptionValues(rowID, index);
    }
}

function setDefaultOptionValues(rowID, optionID){
    var selectValue = document.querySelector('#row' + rowID + ' select').value;
    if(!DATA_COLLECTION[rowID][optionID]) {
        DATA_COLLECTION[rowID][optionID] = new Array(5);
    }

    DATA_COLLECTION[rowID][optionID][0] = DATA_COLLECTION[rowID][0][0]
    DATA_COLLECTION[rowID][optionID][1] = DATA_COLLECTION[rowID][0][1]
    DATA_COLLECTION[rowID][optionID][2] = DATA_COLLECTION[rowID][0][2]

    if(selectValue === 'boolean'){
        DATA_COLLECTION[rowID][0][3] = 'true';
        DATA_COLLECTION[rowID][optionID][3] = 'false';
    }
}

function setDefaultBoolValues(rowID, optionID){
    DATA_COLLECTION[rowID][0][3] = 'True';
    DATA_COLLECTION[rowID][optionID][3] = 'False'
}

function updateChildOptionValues(rowID, index){
    Object.keys(DATA_COLLECTION[rowID]).forEach((option) => {
        DATA_COLLECTION[rowID][option][index] = DATA_COLLECTION[rowID][0][index];
    })
}

function setPageButtonListeners(){
    document.querySelectorAll('#add-row, #export-file').forEach((button) => {
        if(button.id === 'add-row'){
            button.addEventListener('click', addNewRow);
        } else {
            button.addEventListener('click', generateMappingFile);
        }
    })
}

function generateMappingFile(){
    if (validateInputs() === true) {
        var fileHeader = 'Field_Name,Display_Field_Name,Type,Dropdown_Source_Value,Dropdown_Display_Value\n';
        var text = fileHeader + getMappingFileBody();
        var filename = "CRM-mapping_" + Date.now() + ".csv";
        downloadFile(filename, text);
        enableSampleButton();

    } else {
        displayErrorMessage();
    }
}

function enableSampleButton(){
    var downloadSampleButton = document.getElementById('generate-crm-sample');
    downloadSampleButton.classList.remove('disabled');
    downloadSampleButton.addEventListener('click', generateSampleFile);
}

function getMappingFileBody(){
    return Object.keys(DATA_COLLECTION).map((obj) => {
        return Object.keys(DATA_COLLECTION[obj]).map((arr) => {
            DATA_COLLECTION[obj][arr].forEach((value) => {
                if(value === 'undefined') return 'NULL';
            })
            return DATA_COLLECTION[obj][arr].join(',');
        }).join('\n');
    }).join('\n');
}

function generateSampleFile(){
    var fileHeader = getSampleFileHeader();
    var fileBody = [];
    var filename = "CRM-sample_" + Date.now() + ".csv";

    for(i=0; i<10; i++){
        fileBody.push(getSampleRow());
    }

    var text = [fileHeader.join(','), fileBody.join('\n')].join('\n');

    downloadFile(filename, text);
}

function getSampleFileHeader(){
    var head = Object.keys(DATA_COLLECTION).map((obj) => {
        return DATA_COLLECTION[obj][0][0];
    });
    head.unshift('cuid');
    return head;
}

function getSampleRow(){
    var body = Object.keys(DATA_COLLECTION).map((obj) => {
        return returnRandomValue(DATA_COLLECTION[obj]);
    });
    body.unshift(faker.random.uuid());
    return body.join(',');
}

function returnRandomValue(dataObject){
    switch(dataObject[0][2]) {
        case 'string':
            return faker.random.words();
        case 'int':
            return faker.random.number();
        case 'double':
            return  faker.random.number() * 0.1;
        case 'long':
            return  faker.random.number() * 1000000000000;
        case 'date':
            return  new Date().toISOString().slice(0, 10)
        case 'boolean':
            return  faker.random.boolean();
        case 'bucket':
            var largest = 0;
            var smallest = parseInt(dataObject[0][3].split('..')[0])
            Object.keys(dataObject).forEach((el) => {
                var min = parseInt(dataObject[el][3].split('..')[0]);
                var max = parseInt(dataObject[el][3].split('..')[1])
                if (largest < max) largest = max;
                if (smallest > min) smallest = min;
            })
            return  Math.floor(Math.random() * (largest - smallest + 1)) + smallest
        case 'enum':
            var numOfOptions = Object.keys(dataObject).length;
            var randomArray = Math.floor(Math.random() * numOfOptions);
            return  dataObject[randomArray][3];
        case 'array':
            return Object.keys(dataObject).map((el) => {
                return dataObject[el][3]
            }).join('|');
        default:
            return  'NULL';
    }
}

function displayErrorMessage(){
    var errorMessage = document.getElementById('error-message');
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 3000) 
}

function validateInputs() {
    var result = true;
    [].slice.call(document.querySelectorAll('.crm-row:not(.row-template) input, .crm-row:not(.row-template) select')).forEach(field => {
        if (field.tagName === "SELECT" && field.value === "unselected") {
            field.classList.add('invalid');
            result = false;
        }
        if (field.tagName === "INPUT" && field.disabled === false && field.value === "") {
            field.classList.add('invalid');
            result = false;
        }
    })

    return result;
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getParent(element, selector) {
    var currentElement = element;
  
    do {
      currentElement = currentElement.parentNode;
      if (currentElement.matches(selector)) {
        return currentElement;
      }
    } while (currentElement.nodeName.toLowerCase() !== 'body');
  
    return null;
  }
